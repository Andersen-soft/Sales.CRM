package com.andersenlab.crm.rest.resolvers;

import com.querydsl.core.types.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.MethodParameter;
import org.springframework.core.convert.ConversionService;
import org.springframework.data.querydsl.binding.QuerydslBindingsFactory;
import org.springframework.data.web.querydsl.QuerydslPredicateArgumentResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Наследуемся от {@link QuerydslPredicateArgumentResolver} для возможности посвоему резолвить параметры запроса в
 * предикат.
 */
@Component
public class CrmPredicateMethodArgumentResolver extends QuerydslPredicateArgumentResolver {

    @Autowired
    public CrmPredicateMethodArgumentResolver(QuerydslBindingsFactory factory, ConversionService conversionService) {
        super(factory, conversionService);
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CrmPredicate.class) || super.supportsParameter(parameter);
    }

    @Override
    public Predicate resolveArgument(MethodParameter parameter,
                                     ModelAndViewContainer mavContainer,
                                     NativeWebRequest webRequest,
                                     WebDataBinderFactory binderFactory) throws Exception {
        if (parameter.hasParameterAnnotation(CrmPredicate.class)) {
            CrmPredicate annotation = parameter.getParameterAnnotation(CrmPredicate.class);
            if (annotation == null) {
                return null;
            }
            Class<? extends PredicateResolver> resolver = annotation.resolver();
            PredicateResolver predicateResolver = resolver.newInstance();
            return predicateResolver.resolvePredicate(webRequest);
        } else {
            return super.resolveArgument(parameter, mavContainer, webRequest, binderFactory);
        }
    }
}
