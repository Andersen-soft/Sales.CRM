package com.andersenlab.crm.configuration.swagger;

import com.fasterxml.classmate.ResolvedType;
import com.fasterxml.classmate.TypeResolver;
import com.google.common.base.Function;
import com.google.common.base.Optional;
import com.querydsl.core.types.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestPart;
import springfox.documentation.builders.ParameterBuilder;
import springfox.documentation.schema.ModelReference;
import springfox.documentation.schema.ResolvedTypes;
import springfox.documentation.schema.TypeNameExtractor;
import springfox.documentation.service.Parameter;
import springfox.documentation.service.ResolvedMethodParameter;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spi.schema.contexts.ModelContext;
import springfox.documentation.spi.service.OperationBuilderPlugin;
import springfox.documentation.spi.service.contexts.OperationContext;
import springfox.documentation.spi.service.contexts.ParameterContext;

import java.lang.reflect.Field;
import java.util.List;

import static com.google.common.collect.Lists.newArrayList;
import static springfox.documentation.spi.schema.contexts.ModelContext.inputParam;

@Component
public class TransformSwaggerParameters implements OperationBuilderPlugin {

    private final TypeNameExtractor nameExtractor;
    private final TypeResolver typeResolver;
    private final ResolvedType predicateTypes;

    @Autowired
    public TransformSwaggerParameters(TypeNameExtractor nameExtractor,
                                      TypeResolver typeResolver) {
        this.nameExtractor = nameExtractor;
        this.typeResolver = typeResolver;
        this.predicateTypes = typeResolver.resolve(Predicate.class);
    }

    @Override
    public void apply(OperationContext context) {
        List<ResolvedMethodParameter> methodParameters = context.getParameters();

        for (ResolvedMethodParameter methodParameter : methodParameters) {
            ResolvedType resolvedType = methodParameter.getParameterType();

            ParameterContext paramContext = getParamContext(methodParameter, context);

            Function<ResolvedType, ? extends ModelReference> factory = createModelRefFactory(paramContext);
            if (predicateTypes.equals(resolvedType)) {
                addPredicateParametersToContext(methodParameter, context, factory);
            }
            if(methodParameter.hasParameterAnnotation(RequestPart.class)) {
                addRequestPartBodyToContext(methodParameter, context, factory);
            }
        }
    }

    private void addPredicateParametersToContext(ResolvedMethodParameter methodParameter,
                                                 OperationContext context,
                                                 Function<ResolvedType, ? extends ModelReference> factory
                                   ) {
        List<Parameter> parameters = newArrayList();
        Optional<QuerydslPredicate> annotation = methodParameter.findAnnotation(QuerydslPredicate.class);
        if(annotation.isPresent()) {
            QuerydslPredicate querydslPredicate = annotation.get();
            Class<?> root = querydslPredicate.root();
            Field[] declaredFields = root.getDeclaredFields();
            for (Field field :
                    declaredFields) {
                ModelReference modelReference = factory.apply(typeResolver.resolve(field.getType()));
                parameters.add(new ParameterBuilder().allowMultiple(false)
                        .parameterType("query")
                        .name(field.getName())
                        .modelRef(modelReference)
                        .description("Filter field: " + field.getName())
                        .build());
            }
        }
        context.operationBuilder().parameters(parameters);
    }

    private void addRequestPartBodyToContext(ResolvedMethodParameter methodParameter,
                                             OperationContext context,
                                             Function<ResolvedType, ? extends ModelReference> factory) {
        List<Parameter> parameters = newArrayList();
        Optional<RequestPart> annotation = methodParameter.findAnnotation(RequestPart.class);
        if(annotation.isPresent()) {
            RequestPart requestPart = annotation.get();
            if("json".equals(requestPart.name())) {
                parameters.add(new ParameterBuilder().allowMultiple(false)
                        .parameterType("body")
                        .name("Model")
                        .modelRef(factory.apply(typeResolver.resolve(methodParameter.getParameterType())))
                        .description("@RequestPart Model")
                        .build());
            }
        }
        context.operationBuilder().parameters(parameters);
    }

    private ParameterContext getParamContext(ResolvedMethodParameter methodParameter,
                                             OperationContext context) {
        return new ParameterContext(
                methodParameter,
                new ParameterBuilder(),
                context.getDocumentationContext(),
                context.getGenericsNamingStrategy(),
                context);
    }

    private Function<ResolvedType, ? extends ModelReference> createModelRefFactory(ParameterContext context) {
        ModelContext modelContext = inputParam(
                context.getGroupName(),
                context.resolvedMethodParameter().getParameterType(),
                context.getDocumentationType(),
                context.getAlternateTypeProvider(),
                context.getGenericNamingStrategy(),
                context.getIgnorableParameterTypes());
        return ResolvedTypes.modelRefFactory(modelContext, nameExtractor);
    }

    @Override
    public boolean supports(DocumentationType delimiter) {
        return true;
    }
}
