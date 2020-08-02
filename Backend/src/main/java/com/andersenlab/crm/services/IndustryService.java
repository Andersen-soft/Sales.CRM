package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.rest.response.SaleReportIndustryResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IndustryService {

    List<Industry> getAllIndustries();

    Page<SaleReportIndustryResponse> findAllBySaleReport(Predicate predicate, Pageable pageable);
}
