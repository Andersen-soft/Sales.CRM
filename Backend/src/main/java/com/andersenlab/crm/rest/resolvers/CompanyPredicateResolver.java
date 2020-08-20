package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.QCompany;
import com.andersenlab.crm.model.entities.QEstimationRequest;
import com.andersenlab.crm.model.view.QSaleReport;
import com.andersenlab.crm.utils.ServiceUtils;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.web.context.request.NativeWebRequest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

public class CompanyPredicateResolver implements PredicateResolver {

    private static final QCompany COMPANY = QCompany.company;

    @Override
    public Predicate resolvePredicate(NativeWebRequest webRequest) {
        List<String> names = WebRequestHelper.extractStringParameterList(webRequest, "name");
        String url = WebRequestHelper.extractStringParameter(webRequest, "url");
        String phone = WebRequestHelper.extractStringParameter(webRequest, "phone");
        Long responsibleRmId = WebRequestHelper.extractLongParameter(webRequest, "responsibleRmId");
        List<LocalDateTime> createDates = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "createDate",
                dateTime -> LocalDateTime.parse(dateTime, DateTimeFormatter.ISO_DATE_TIME));
        return new BooleanBuilder()
                .and(withNames(names))
                .and(withPhone(phone))
                .and(withUrl(url))
                .and(withResponsibleRmId(responsibleRmId))
                .and(withDateRange(createDates))
                .and(withEstimationRequest(webRequest))
                .and(withSaleReport(webRequest));
    }

    private Predicate withSaleReport(NativeWebRequest webRequest) {
        QSaleReport saleReport = QSaleReport.saleReport;

        Boolean isSaleReport = WebRequestHelper.extractBooleanParameter(
                webRequest,
                "saleReport.isSaleReportFilter");

        BooleanBuilder predicate = new BooleanBuilder();

        if (isSaleReport != null && isSaleReport) {
            predicate = buildSaleReportPredicate(webRequest).and(saleReport.companyId.eq(COMPANY.id));
        }

        return JPAExpressions
                .selectOne()
                .from(saleReport)
                .where(predicate)
                .exists();
    }

    private static Predicate withEstimationRequest(NativeWebRequest webRequest) {
        Boolean isEstimationRequest = WebRequestHelper.extractBooleanParameter(
                webRequest,
                "estimationRequest.isEstimationRequestFilter");
        String name = WebRequestHelper.extractStringParameter(
                webRequest,
                "estimationRequest.name");
        Long companyId = WebRequestHelper.extractLongParameter(
                webRequest,
                "estimationRequest.companyId");
        Long responsibleId = WebRequestHelper.extractLongParameter(
                webRequest,
                "estimationRequest.responsibleId");
        Long creatorId = WebRequestHelper.extractLongParameter(
                webRequest,
                "estimationRequest.creatorId");
        QEstimationRequest estimationRequest = QEstimationRequest.estimationRequest;
        List<EstimationRequest.Status> statuses = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "estimationRequest.status",
                value -> ServiceUtils.getByNameOrThrow(EstimationRequest.Status.class, value));

        BooleanExpression statusesExpression
                = statuses != null && !statuses.isEmpty() ? estimationRequest.status.in(statuses) : null;

        BooleanBuilder predicate = new BooleanBuilder()
                .and(getNullable(name, estimationRequest.id.stringValue().concat(" - ").concat(estimationRequest.name)::containsIgnoreCase))
                .and(getNullable(companyId, estimationRequest.company.id::eq))
                .and(getNullable(responsibleId, estimationRequest.responsibleForRequest.id::eq))
                .and(getNullable(creatorId, estimationRequest.author.id::eq))
                .and(estimationRequest.isActive.isTrue())
                .and(statusesExpression);

        if (isEstimationRequest != null && isEstimationRequest) {
            predicate = predicate.and(COMPANY.id.eq(estimationRequest.company.id));
        }
        return JPAExpressions
                .selectOne()
                .from(estimationRequest)
                .where(predicate)
                .exists();
    }

    private Predicate withNames(List<String> names) {
        BooleanBuilder predicate = new BooleanBuilder();
        names.forEach(name -> predicate.or(COMPANY.name.containsIgnoreCase(name)));
        return predicate;
    }

    private Predicate withUrl(String url) {
        return getNullable(url, COMPANY.url::containsIgnoreCase);
    }

    private Predicate withPhone(String phone) {
        return getNullable(phone, COMPANY.phone::containsIgnoreCase);
    }

    private Predicate withResponsibleRmId(final Long responsibleRmId) {
        return getNullable(responsibleRmId, COMPANY.responsible.id::eq);
    }

    private Predicate withDateRange(List<LocalDateTime> createDates) {
        return getDatePredicate(COMPANY.createDate, createDates);
    }
}
