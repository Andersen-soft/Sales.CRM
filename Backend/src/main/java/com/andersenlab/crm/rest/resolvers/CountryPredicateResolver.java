package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.entities.QCountry;
import com.andersenlab.crm.model.view.QSaleReport;
import com.andersenlab.crm.model.view.QSocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.Spliterators;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

public class CountryPredicateResolver implements PredicateResolver {

    private static final QCountry COUNTRY = QCountry.country;

    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {
        Long id = WebRequestHelper.extractLongParameter(webRequest, "id");
        String name = WebRequestHelper.extractStringParameter(webRequest, "name");

        boolean isSocialAnswer = StreamSupport
                .stream(Spliterators.spliteratorUnknownSize(webRequest.getParameterNames(), 0), false)
                .anyMatch(name1 -> name1.contains("socialAnswer"));

        QSocialNetworkAnswerSalesHeadView view = QSocialNetworkAnswerSalesHeadView.socialNetworkAnswerSalesHeadView;
        BooleanExpression answerPredicate = JPAExpressions
                .selectOne()
                .from(view)
                .where(view.country.id.eq(COUNTRY.id).and(buildSocialAnswerPredicate(webRequest)))
                .exists();

        return new BooleanBuilder()
                .and(withId(id))
                .and(withNames(name))
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
            predicate = buildSaleReportPredicate(webRequest).and(saleReport.countryId.eq(COUNTRY.id));
        }

        return JPAExpressions
                .selectOne()
                .from(saleReport)
                .where(predicate)
                .exists();
    }

    private Predicate withId(Long id){
        return getNullable(id, COUNTRY.id::eq);
    }

    private Predicate withNames(String name) {
        BooleanBuilder builder = new BooleanBuilder();
        return builder.or(getNullable(name, COUNTRY.nameRu::containsIgnoreCase))
                .or(getNullable(name, COUNTRY.nameEn::containsIgnoreCase));
    }
}
