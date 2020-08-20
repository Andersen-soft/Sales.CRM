package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.request.CompanyFilterRequest;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CompanyFacade {

    Page<CompanyResponse> getCompaniesWithFilter(Predicate predicate, Pageable pageable);

    List<CompanyResponse> getCompaniesWithFilterByResumeRequestView(Predicate predicate, Pageable pageable);

    Page<CompanyResponse> getCompaniesForGlobalSearch(CompanyFilterRequest filterRequest, Pageable pageable, Boolean isFullCompanyInfo);

    Page<CompanyResponse> getSaleReportCompanies(Predicate predicate, Pageable pageable);

    Page<CompanyResponse> getCompaniesByNameFilter(String filter, Pageable pageable);
}
