package com.andersenlab.crm.services;

import com.andersenlab.crm.dbtools.dto.CompanyReport;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import com.andersenlab.crm.rest.request.CompanyFilterRequest;
import com.andersenlab.crm.rest.request.CompanyUpdateRequest;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

/**
 * Encapsulates business logic and persistence related to companies.
 *
 * @see Company
 */
public interface CompanyService {

    /**
     * Updates the company with the given name
     *
     * @param id      the name of company to update
     * @param company the updated company
     */
    void updateCompany(Long id, CompanyUpdateRequest company);

    /**
     * Saves a given company
     *
     * @param request the company to save
     */
    Company createCompany(CompanyCreateRequest request);

    Company createCompany(Company company);

    Page<Company> getCompaniesWithFilter(Predicate predicate, Pageable pageable);

    Company findById(Long id);

    Company findCompanyByIdOrThrowException(Long id);

    Page<Company> findByNameFilter(String filter, Pageable pageable);

    Company findCompanyByName(String name);

    Company findCompanyByContactId(Contact contact);

    boolean exist(Long id);

    void validateById(Long companyId);

    Page<Company> getCompaniesForGlobalSearch(CompanyFilterRequest filterRequest, Pageable pageable);

    Page<Company> getPageableCompanies(List<Company> companies, Pageable pageable);

    List<CompanyResponse> getSaleReportCompanies(Predicate predicate, Pageable pageable);

    List<CompanyReport> getCompaniesForReport(LocalDate createDateFrom, LocalDate createDateTo);

    void checkForDD(Company company);
}
