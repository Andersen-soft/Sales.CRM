package com.andersenlab.crm.rest.resolvers;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.QSocialNetworkAnswer;
import com.andersenlab.crm.model.entities.SaleRequestType;
import com.andersenlab.crm.model.entities.SocialNetworkAnswer;
import com.andersenlab.crm.model.view.QSaleReport;
import com.andersenlab.crm.model.view.QSocialNetworkAnswerSalesHeadView;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.repositories.SocialNetworkAnswerSalesHeadViewRepository;
import com.andersenlab.crm.utils.ServiceUtils;
import com.andersenlab.crm.utils.WebRequestHelper;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.DateTimePath;
import org.springframework.web.context.request.NativeWebRequest;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;
import static com.andersenlab.crm.utils.ConverterHelper.getNullableList;
import static com.andersenlab.crm.utils.PredicateHelper.emptyIfNull;

/**
 * Создает объект типа Predicate из переданных параметров запроса {@link Predicate}
 */
public interface PredicateResolver {

    Predicate resolvePredicate(NativeWebRequest webRequest);

    default Predicate buildSocialAnswerPredicate(NativeWebRequest webRequest) {
        List<SocialNetworkAnswer.Status> statuses = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "socialAnswer.status",
                value -> ServiceUtils.getByNameOrThrow(SocialNetworkAnswer.Status.class, value));
        List<LocalDateTime> createDates = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "socialAnswer.createDate",
                dateTime -> LocalDateTime.parse(dateTime, DateTimeFormatter.ISO_DATE_TIME));
        Long assistantId = WebRequestHelper.extractLongParameter(
                webRequest,
                "socialAnswer.assistant");
        Long responsibleId = WebRequestHelper.extractLongParameter(
                webRequest,
                "socialAnswer.responsible");
        List<Long> sourcesIds = WebRequestHelper.extractLongParameterList(
                webRequest,
                "socialAnswer.source");
        Long contactId = WebRequestHelper.extractLongParameter(
                webRequest,
                "socialAnswer.socialContact");
        Long countryId = WebRequestHelper.extractLongParameter(
                webRequest,
                "socialAnswer.country");
        String search = WebRequestHelper.extractStringParameter(
                webRequest,
                "socialAnswer.search");

        QSocialNetworkAnswerSalesHeadView view = QSocialNetworkAnswerSalesHeadView.socialNetworkAnswerSalesHeadView;
        BooleanExpression statusesExpression
                = statuses != null && !statuses.isEmpty() ? view.status.in(statuses) : null;
        BooleanExpression sourcesExpression
                = sourcesIds != null && !sourcesIds.isEmpty() ? view.source.id.in(sourcesIds) : null;

        return new BooleanBuilder()
                .and(statusesExpression)
                .and(getNullable(assistantId, view.assistant.id::eq))
                .and(getNullable(responsibleId, view.responsible.id::eq))
                .and(sourcesExpression)
                .and(getNullable(contactId, view.socialNetworkContact.id::eq))
                .and(getNullable(countryId, view.country.id::eq))
                .and(getNullable(search, SocialNetworkAnswerSalesHeadViewRepository::defineSearchPredicate))
                .and(getDatePredicate(view.createDate, createDates));
    }

    default BooleanBuilder buildSaleReportPredicate(NativeWebRequest webRequest) {
        QSaleReport saleReport = QSaleReport.saleReport;

        List<LocalDateTime> createDates = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "saleReport.createLeadDate",
                dateTime -> LocalDateTime.parse(dateTime, DateTimeFormatter.ISO_DATE_TIME));
        List<CompanySale.Status> statuses = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "saleReport.status",
                value -> ServiceUtils.getByNameOrThrow(CompanySale.Status.class, value));
        List<Long> sourceIds = WebRequestHelper.extractLongParameterList(
                webRequest,
                "saleReport.sourceId");
        List<String> sourceNames = WebRequestHelper.extractStringParameterList(
                webRequest,
                "saleReport.sourceName");
        List<Long> responsibleIds = WebRequestHelper.extractLongParameterList(
                webRequest,
                "saleReport.responsibleId");
        List<String> responsibleNames = WebRequestHelper.extractStringParameterList(
                webRequest,
                "saleReport.responsibleName");
        List<Long> weights = WebRequestHelper.extractLongParameterList(
                webRequest,
                "saleReport.weight");
        List<String> countryNames = WebRequestHelper.extractStringParameterList(
                webRequest,
                "saleReport.countryName");
        List<LocalDateTime> statusChangedDates = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "saleReport.statusChangedDate",
                dateTime -> LocalDateTime.parse(dateTime, DateTimeFormatter.ISO_DATE_TIME));
        List<LocalDateTime> lastActivityDates = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "saleReport.lastActivityDate",
                dateTime -> LocalDateTime.parse(dateTime, DateTimeFormatter.ISO_DATE_TIME));
        List<String> socialContactNames = WebRequestHelper.extractStringParameterList(
                webRequest,
                "saleReport.socialContactName");
        List<String> companyNames = WebRequestHelper.extractStringParameterList(
                webRequest,
                "saleReport.companyName");
        List<SaleRequestType> types = WebRequestHelper.extractMappedParameterList(
                webRequest,
                "saleReport.type",
                value -> ServiceUtils.getByNameOrThrow(SaleRequestType.class, value));
        String search = WebRequestHelper.extractStringParameter(
                webRequest,
                "saleReport.search");

        BooleanExpression statusesExpression = getNullableList(statuses, saleReport.status::in);
        BooleanExpression sourceIdsExpression = getNullableList(sourceIds, saleReport.sourceId::in);
        BooleanExpression sourceNamesExpression = getNullableList(sourceNames, saleReport.sourceName::in);
        BooleanExpression responsibleIdsExpression = getNullableList(responsibleIds, saleReport.responsibleId::in);
        BooleanExpression responsibleNamesExpression = getNullableList(responsibleNames, saleReport.responsibleName::in);
        BooleanExpression wightsExpression = getNullableList(weights, saleReport.weight::in);
        BooleanExpression countryNamesExpression = getNullableList(countryNames, saleReport.countryName::in);
        BooleanExpression socialContactNamesExpression = getNullableList(socialContactNames, saleReport.socialContactName::in);
        BooleanExpression companyNamesExpression = getNullableList(companyNames, saleReport.companyName::in);
        BooleanExpression typesExpression = getNullableList(types, saleReport.type::in);
        Predicate searchExpression = getNullable(search, ReportRepository::defineSearchPredicate);

        return new BooleanBuilder()
                .and(statusesExpression)
                .and(sourceIdsExpression)
                .and(sourceNamesExpression)
                .and(responsibleIdsExpression)
                .and(responsibleNamesExpression)
                .and(wightsExpression)
                .and(countryNamesExpression)
                .and(getDatePredicate(saleReport.createLeadDate, createDates))
                .and(getDatePredicate(saleReport.statusChangedDate, statusChangedDates))
                .and(getDatePredicate(saleReport.lastActivityDate, lastActivityDates))
                .and(socialContactNamesExpression)
                .and(companyNamesExpression)
                .and(typesExpression)
                .and(searchExpression);
    }

    default Predicate getDatePredicate(DateTimePath<LocalDateTime> path, Collection<LocalDateTime> value) {
        List<? extends LocalDateTime> dates = new ArrayList<>(value);
        if (dates.isEmpty()) {
            return null;
        }
        if (dates.size() == 1) {
            return path.between(
                    dates.get(0).toLocalDate().atTime(LocalTime.MIN),
                    dates.get(0).toLocalDate().atTime(LocalTime.MAX));
        } else {
            return path.between(
                    dates.get(0).toLocalDate().atTime(LocalTime.MIN),
                    dates.get(1).toLocalDate().atTime(LocalTime.MAX));
        }
    }

    default Predicate getSearchPredicate(String value) {
        QSocialNetworkAnswer view = QSocialNetworkAnswer.socialNetworkAnswer;
        return emptyIfNull(view.assistant.firstName)
                .concat(" ")
                .concat(emptyIfNull(view.assistant.lastName))
                .containsIgnoreCase(value)
                .or(emptyIfNull(view.socialNetworkContact.sales.firstName)
                        .concat(" ")
                        .concat(emptyIfNull(view.socialNetworkContact.sales.lastName))
                        .containsIgnoreCase(value))
                .or(emptyIfNull(view.socialNetworkContact.source.name).containsIgnoreCase(value))
                .or(emptyIfNull(view.socialNetworkContact.socialNetworkUser.name).containsIgnoreCase(value))
                .or(emptyIfNull(view.message).containsIgnoreCase(value))
                .or(emptyIfNull(view.linkLead).containsIgnoreCase(value))
                .or(emptyIfNull(view.firstName).containsIgnoreCase(value))
                .or(emptyIfNull(view.lastName).containsIgnoreCase(value))
                .or(emptyIfNull(view.sex.stringValue()).containsIgnoreCase(value))
                .or(emptyIfNull(view.position).containsIgnoreCase(value))
                .or(emptyIfNull(view.country.nameRu).containsIgnoreCase(value))
                .or(emptyIfNull(view.country.nameEn).containsIgnoreCase(value))
                .or(emptyIfNull(view.skype).containsIgnoreCase(value))
                .or(emptyIfNull(view.email).containsIgnoreCase(value))
                .or(emptyIfNull(view.emailPrivate).containsIgnoreCase(value))
                .or(emptyIfNull(view.phone).containsIgnoreCase(value))
                .or(emptyIfNull(view.companyName).containsIgnoreCase(value))
                .or(emptyIfNull(view.site).containsIgnoreCase(value))
                .or(emptyIfNull(view.phoneCompany).containsIgnoreCase(value));
    }
}
