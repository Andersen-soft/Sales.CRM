package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.QCompanySale;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.repositories.CompanySaleRepository;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.repositories.SourceRepository;
import com.andersenlab.crm.repositories.view.SourceStatisticView;
import com.andersenlab.crm.rest.response.SaleReportCategoryResponse;
import com.andersenlab.crm.rest.response.SaleReportCompanyRecommendationResponse;
import com.andersenlab.crm.rest.response.SaleReportDeliveryDirectorResponse;
import com.andersenlab.crm.rest.response.SaleReportStatusResponse;
import com.andersenlab.crm.rest.response.SaleReportTypeResponse;
import com.andersenlab.crm.rest.response.SourceStatisticResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanySaleReportService;
import com.andersenlab.crm.services.i18n.I18nService;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static com.andersenlab.crm.utils.CrmConstants.NO_VALUE_REPLACER;
import static com.andersenlab.crm.utils.ServiceUtils.employeeRolesContains;
import static com.andersenlab.crm.utils.ServiceUtils.enumConstantsContains;
import static com.andersenlab.crm.utils.ServiceUtils.isRusWord;

@Service
@RequiredArgsConstructor
public class CompanySaleReportServiceImpl implements CompanySaleReportService {
    private final ReportRepository reportRepository;
    private final CompanySaleRepository companySaleRepository;
    private final SourceRepository sourceRepository;
    private final I18nService i18nService;
    private final AuthenticatedUser authenticatedUser;

    @Override
    public Page<SaleReport> getCompanySaleReports(Predicate predicate, Pageable pageable) {
        return reportRepository.findAll(predicate, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public SourceStatisticResponse getSourcesStatisticWithLocale(LocalDate creationFrom, LocalDate creationTo, Locale locale) {
        Map<String, Object> rusWords = new TreeMap<>();
        Map<String, Object> engWords = new TreeMap<>();
        Map<String, Object> sortedByLanguages = new LinkedHashMap<>();
        final Map<String, Object> result = getStatistics(creationFrom, creationTo).stream()
                .collect(Collectors.toMap(k -> {
                    if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
                        return k.getNameEn();
                    } else {
                        return k.getName();
                    }
                }, SourceStatisticView::getLeads));

        List<Source> sources = sourceRepository.findAll();
        sources.forEach(source -> {
            if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())
                    && source.getNameEn() != null) {
                result.putIfAbsent(source.getNameEn(), 0L);
            } else {
                result.putIfAbsent(source.getName(), 0L);
            }
        });

        result.forEach((key, value) -> {
            if (isRusWord(key)) {
                rusWords.put(key, value);
            } else {
                engWords.put(key, value);
            }
        });

        rusWords.forEach(sortedByLanguages::put);
        engWords.forEach(sortedByLanguages::put);

        return new SourceStatisticResponse(sortedByLanguages, getSalesWithoutMainContact(creationFrom, creationTo));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReportTypeResponse> getReportTypes(Predicate predicate, Pageable pageable, Locale locale) {
        List<SaleReportTypeResponse> statuses = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(sr -> SaleReportTypeResponse.builder()
                        .reportTypeOrdinal(sr.getType().ordinal())
                        .reportType(i18nService.getLocalizedMessage(sr.getType().getName(), locale))
                        .reportTypeEnumCode(sr.getType().name())
                        .build())
                .distinct()
                .collect(Collectors.toList());
        return new PageImpl<>(statuses, pageable, statuses.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReportStatusResponse> getReportStatuses(Predicate predicate, Pageable pageable, Locale locale) {
        List<SaleReportStatusResponse> statuses = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(SaleReport::getStatus)
                .distinct()
                .map(st -> SaleReportStatusResponse.builder()
                        .statusOrdinal(st.ordinal())
                        .status(i18nService.getLocalizedMessage(st.getName(), locale))
                        .statusEnumCode(st.name())
                        .build())
                .collect(Collectors.toList());
        return new PageImpl<>(statuses, pageable, statuses.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReportCategoryResponse> getReportCategories(Predicate predicate, Pageable pageable) {
        List<SaleReportCategoryResponse> categories = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(SaleReport::getCategory)
                .distinct()
                .map(this::resolveStringCategory)
                .collect(Collectors.toList());
        return new PageImpl<>(categories, pageable, categories.size());
    }

    private SaleReportCategoryResponse resolveStringCategory(String category) {
        SaleReportCategoryResponse result;
        if (category != null
                && !NO_VALUE_REPLACER.equalsIgnoreCase(category)
                && enumConstantsContains(CompanySale.Category.class, category)) {
            CompanySale.Category enumCategory = CompanySale.Category.valueOf(category);
            result = resolveEnumCategory(enumCategory);
        } else {
            result = buildCategoryResponseWithNoValue();
        }

        return result;
    }

    private SaleReportCategoryResponse resolveEnumCategory(CompanySale.Category category) {
        if (category != null) {
            return SaleReportCategoryResponse.builder()
                    .categoryOrdinal(category.ordinal())
                    .categoryEnumCode(category.name())
                    .category(category.name())
                    .build();
        } else {
            return buildCategoryResponseWithNoValue();
        }
    }

    private SaleReportCategoryResponse buildCategoryResponseWithNoValue() {
        return SaleReportCategoryResponse.builder()
                .categoryOrdinal(-1)
                .categoryEnumCode(null)
                .category(NO_VALUE_REPLACER)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReportCompanyRecommendationResponse> getCompanyRecommendationsForSaleReport(Predicate predicate, Pageable pageable) {
        List<SaleReportCompanyRecommendationResponse> recommendationList = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(report -> SaleReportCompanyRecommendationResponse.builder()
                        .id(report.getCompanyRecommendationId())
                        .name(report.getCompanyRecommendationName())
                        .build())
                .distinct()
                .collect(Collectors.toList());
        return new PageImpl<>(recommendationList, pageable, recommendationList.size());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SaleReportDeliveryDirectorResponse> getDeliveryDirectorsForSaleReport(Predicate predicate, Pageable pageable) {
        List<SaleReportDeliveryDirectorResponse> ddList = StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(report -> SaleReportDeliveryDirectorResponse.builder()
                        .id(report.getCompanyResponsibleRmId())
                        .name(report.getCompanyResponsibleRmName())
                        .build())
                .distinct()
                .collect(Collectors.toList());
        return new PageImpl<>(ddList, pageable, ddList.size());
    }

    private List<SourceStatisticView> getStatistics(LocalDate creationFrom, LocalDate creationTo) {
        if (employeeRolesContains(authenticatedUser.getCurrentEmployee(), ROLE_SALES)
                && !employeeRolesContains(authenticatedUser.getCurrentEmployee(), RoleEnum.ROLE_SALES_HEAD)) {
            return companySaleRepository.getSalesSourcesStatistic(
                    LocalDateTime.of(creationFrom, LocalTime.MIN),
                    LocalDateTime.of(creationTo, LocalTime.MAX),
                    authenticatedUser.getCurrentEmployee());
        } else {
            return companySaleRepository.getSalesSourcesStatistic(
                    LocalDateTime.of(creationFrom, LocalTime.MIN),
                    LocalDateTime.of(creationTo, LocalTime.MAX));
        }
    }

    private List<Long> getSalesWithoutMainContact(LocalDate creationFrom, LocalDate creationTo) {
        BooleanExpression condition = QCompanySale.companySale.mainContact.isNull();
        return getSalesId(condition, getDateRange(creationFrom, creationTo));
    }

    private List<Long> getSalesId(BooleanExpression condition, BooleanExpression dateRange) {
        BooleanExpression p = condition.and(dateRange)
                .and(QCompanySale.companySale.isActive.eq(true));
        if (employeeRolesContains(authenticatedUser.getCurrentEmployee(), ROLE_SALES)
                && !employeeRolesContains(authenticatedUser.getCurrentEmployee(), RoleEnum.ROLE_SALES_HEAD)) {
            p = p.and(QCompanySale.companySale.responsible.id.eq(authenticatedUser.getCurrentEmployee().getId()));
        }
        Iterable<CompanySale> all = companySaleRepository.findAll(p);
        List<Long> result = new ArrayList<>();
        all.forEach(item -> result.add(item.getId()));
        return result;
    }

    private BooleanExpression getDateRange(LocalDate creationFrom, LocalDate creationTo) {
        return QCompanySale.companySale.createDate.between(LocalDateTime.of(creationFrom, LocalTime.MIN),
                LocalDateTime.of(creationTo, LocalTime.MAX));
    }
}
