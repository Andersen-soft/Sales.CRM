package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.QCompany;
import com.andersenlab.crm.model.view.QAllResumeRequestsView;
import com.andersenlab.crm.rest.request.CompanyFilterRequest;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import com.andersenlab.crm.services.CompanyService;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static java.util.Optional.ofNullable;

@Service
@RequiredArgsConstructor
public class CompanyFacadeImpl implements CompanyFacade {

    private final CompanyService companyService;
    private final ConversionService conversionService;

    @Override
    public Page<CompanyResponse> getCompaniesWithFilter(Predicate predicate, Pageable pageable) {
        Page<Company> companiesPage = companyService.getCompaniesWithFilter(predicate, pageable);
        return new PageImpl<>(fillCompanyResponses(companiesPage, new ArrayList<>(), false));
    }

    @Override
    public List<CompanyResponse> getCompaniesWithFilterByResumeRequestView(Predicate predicate, Pageable pageable) {
        QAllResumeRequestsView root = QAllResumeRequestsView.allResumeRequestsView;
        JPQLQuery<Tuple> where = JPAExpressions
                .select()
                .from(root)
                .where(QAllResumeRequestsView.allResumeRequestsView.companyId.eq(QCompany.company.id)
                        .and(predicate));
        Page<Company> companiesPage = companyService.getCompaniesWithFilter(where.exists(), pageable);
        return fillCompanyResponses(companiesPage, new ArrayList<>(), false);
    }

    private List<CompanyResponse> fillCompanyResponses(Iterable<Company> companies, List<CompanyResponse> companyResponses, boolean isRm) {
        companies.forEach(company -> {
            CompanyResponse companyResponse = new CompanyResponse();
            companyResponse.setId(company.getId());
            companyResponse.setName(company.getName());
            companyResponses.add(companyResponse);
            if (isRm) {
                ofNullable(company.getResponsible()).ifPresent(employee -> companyResponse.setResponsibleRm(
                        conversionService.convert(employee, EmployeeResponse.class)));
            }
        });
        return companyResponses;
    }

    @Override
    public Page<CompanyResponse> getSaleReportCompanies(Predicate predicate, Pageable pageable) {
        List<CompanyResponse> companies = companyService.getSaleReportCompanies(predicate, pageable);
        return new PageImpl<>(companies, pageable, companies.size());
    }

    @Override
    public Page<CompanyResponse> getCompaniesForGlobalSearch(CompanyFilterRequest filterRequest, Pageable pageable, Boolean isFullCompanyInfo) {
        Page<CompanyResponse> companyResponses;
        Page<Company> pageableCompanies = companyService.getCompaniesForGlobalSearch(filterRequest, pageable);
        if (Boolean.TRUE.equals(isFullCompanyInfo) || !filterRequest.hasFilter()) {
            companyResponses = conversionService.convertToPage(pageable, pageableCompanies, CompanyResponse.class);
        } else {
            companyResponses = new PageImpl<>(fillCompanyResponses(pageableCompanies, new ArrayList<>(), true));
        }
        return companyResponses;
    }

    @Override
    public Page<CompanyResponse> getCompaniesByNameFilter(String filter, Pageable pageable) {
        PageRequest noSortPageRequest = new PageRequest(pageable.getPageNumber(), pageable.getPageSize());
        Page<Company> companies = companyService.findByNameFilter(filter, noSortPageRequest);
        return conversionService.convertToPage(pageable, companies, CompanyResponse.class);
    }
}
