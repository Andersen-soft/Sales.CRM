package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.entities.QSocialNetworkUser;
import com.andersenlab.crm.model.view.QSaleReport;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.web.context.request.NativeWebRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

public class SocialNetworkUserPredicateResolver implements PredicateResolver {

    private static final QSocialNetworkUser USER = QSocialNetworkUser.socialNetworkUser;

    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {
        Long id = WebRequestHelper.extractLongParameter(webRequest, "id");
        String name = WebRequestHelper.extractStringParameter(webRequest, "name");
        List<LocalDateTime> createDates = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "createDate",
                dateTime -> LocalDateTime.parse(dateTime, DateTimeFormatter.ISO_DATE_TIME));

        return new BooleanBuilder()
                .and(withId(id))
                .and(withName(name))
                .and(getDatePredicate(USER.createDate, createDates))
                .and(withSaleReport(webRequest));

    }

    private Predicate withSaleReport(NativeWebRequest webRequest) {
        QSaleReport saleReport = QSaleReport.saleReport;

        Boolean isSaleReport = WebRequestHelper.extractBooleanParameter(
                webRequest,
                "saleReport.isSaleReportFilter");

        BooleanBuilder predicate = new BooleanBuilder();

        if(isSaleReport != null && isSaleReport){
            predicate = buildSaleReportPredicate(webRequest).and(saleReport.socialContactId.eq(USER.id));
        }

        return JPAExpressions
                .selectOne()
                .from(saleReport)
                .where(predicate)
                .exists();
    }

    private Predicate withId(Long id) {
        return getNullable(id, USER.id::eq);
    }

    private Predicate withName(String name) {
        return getNullable(name, USER.name::eq);
    }
}
