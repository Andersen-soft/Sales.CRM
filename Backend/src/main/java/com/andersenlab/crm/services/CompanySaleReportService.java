package com.andersenlab.crm.services;

import com.andersenlab.crm.model.view.SaleReport;
import com.andersenlab.crm.rest.response.*;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Locale;

public interface CompanySaleReportService {
    Page<SaleReport> getCompanySaleReports(Predicate predicate, Pageable pageable);

    SourceStatisticResponse getSourcesStatisticWithLocale(LocalDate creationFrom, LocalDate creationTo, Locale locale);

    Page<SaleReportTypeResponse> getReportTypes(Predicate predicate, Pageable pageable, Locale locale);

    Page<SaleReportStatusResponse> getReportStatuses(Predicate predicate, Pageable pageable, Locale locale);

    Page<SaleReportCompanyRecommendationResponse> getCompanyRecommendationsForSaleReport(Predicate predicate, Pageable pageable);

    Page<SaleReportDeliveryDirectorResponse> getDeliveryDirectorsForSaleReport(Predicate predicate, Pageable pageable);

    Page<SaleReportCategoryResponse> getReportCategories(Predicate predicate, Pageable pageable);
}
