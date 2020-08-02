package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.entities.QSource;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.model.view.QSaleReport;
import com.andersenlab.crm.model.view.QSocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.utils.ServiceUtils;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.List;
import java.util.Spliterators;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

public class SourcePredicateResolver implements PredicateResolver {

    private static final QSource SOURCE = QSource.source;

    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {
        Long id = WebRequestHelper.extractLongParameter(webRequest, "id");
        String name = WebRequestHelper.extractStringParameter(webRequest, "name");
        List<Source.Type> types = WebRequestHelper.extractMappedParameterList(webRequest, "type",
                value -> ServiceUtils.getByNameOrThrow(Source.Type.class, value));
        boolean isSocialAnswer = StreamSupport
                .stream(Spliterators.spliteratorUnknownSize(webRequest.getParameterNames(), 0), false)
                .anyMatch(name1 -> name1.contains("socialAnswer"));

        QSocialNetworkAnswerSalesHeadView view = QSocialNetworkAnswerSalesHeadView.socialNetworkAnswerSalesHeadView;
        BooleanExpression answerPredicate = JPAExpressions
                .selectOne()
                .from(view)
                .where(view.source.id.eq(SOURCE.id).and(buildSocialAnswerPredicate(webRequest)))
                .exists();

        return new BooleanBuilder()
                .and(withId(id))
                .and(withName(name))
                .and(withTypes(types))
                .and(isSocialAnswer ? answerPredicate : null)
                .and(withSaleReport(webRequest));
    }

    private Predicate withSaleReport(NativeWebRequest webRequest) {
        QSaleReport saleReport = QSaleReport.saleReport;

        Boolean isSaleReport = WebRequestHelper.extractBooleanParameter(
                webRequest,
                "saleReport.isSaleReportFilter");

        BooleanBuilder predicate = new BooleanBuilder();

        if (isSaleReport != null && isSaleReport) {
            predicate = buildSaleReportPredicate(webRequest).and(saleReport.sourceId.eq(SOURCE.id));
        }

        return JPAExpressions
                .selectOne()
                .from(saleReport)
                .where(predicate)
                .exists();
    }

    private Predicate withId(Long id) {
        return getNullable(id, SOURCE.id::eq);
    }

    private Predicate withName(String name) {
        return getNullable(name, SOURCE.name::containsIgnoreCase);
    }

    private Predicate withTypes(List<Source.Type> types) {
        if (!types.isEmpty()) {
            return SOURCE.type.in(types);
        }
        return null;
    }
}
