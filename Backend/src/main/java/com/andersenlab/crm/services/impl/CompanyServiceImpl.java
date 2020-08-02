package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.dbtools.dto.CompanyReport;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.NonUniqueCompanyNameException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.model.entities.QCompany;
import com.andersenlab.crm.repositories.CompanyRepository;
import com.andersenlab.crm.repositories.CompanyResponseDtoRepositoryCustom;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import com.andersenlab.crm.rest.request.CompanyFilterRequest;
import com.andersenlab.crm.rest.request.CompanyUpdateRequest;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.Exporter;
import com.andersenlab.crm.services.distribution.CompanyDDDistributionService;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.Projections;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;
import static org.springframework.transaction.annotation.Isolation.SERIALIZABLE;

@Service
@AllArgsConstructor
public class CompanyServiceImpl implements CompanyService {
    private final CompanyDDDistributionService companyDistributionService;
    private final CompanyRepository companyRepository;
    private final ConversionService conversionService;
    private final ReportRepository reportRepository;
    private final EmployeeRepository employeeRepository;
    private final Exporter exporter;
    private final CompanyResponseDtoRepositoryCustom companyResponseDtoRepository;

    @Override
    @Transactional(isolation = SERIALIZABLE)
    public Company createCompany(CompanyCreateRequest request) {
        checkCompanyNameForUnique(request.getName());
        request.setDescription(fixStringDescription(request.getDescription()));
        Company company = conversionService.convert(request, Company.class);
        company.setCreateDate(LocalDateTime.now());
        company.setIsActive(true);

        return companyRepository.saveAndFlush(company);
    }

    @Override
    @Transactional
    public Company createCompany(Company company) {
        checkCompanyNameForUnique(company.getName());

        company.setCreateDate(LocalDateTime.now());
        company.setIsActive(true);
        return companyRepository.saveAndFlush(company);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyResponse> getSaleReportCompanies(Predicate predicate, Pageable pageable) {
        return StreamSupport
                .stream(reportRepository.findAll(predicate, pageable.getSort()).spliterator(), false)
                .map(sale -> {
                    CompanyResponse companyResponse = new CompanyResponse();
                    companyResponse.setId(sale.getCompanyId());
                    companyResponse.setName(sale.getCompanyName());
                    return companyResponse;
                })
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateCompany(Long id, CompanyUpdateRequest request) {
        Company found = findCompanyByIdOrThrowException(id);
        request.setDescription(fixStringDescription(request.getDescription()));
        companyRepository.saveAndFlush(updateCompanyFields(found, request));
    }

    private Company updateCompanyFields(Company company, CompanyUpdateRequest request) {
        Optional.ofNullable(request.getName())
                .ifPresent(name -> {
                    if (isCompanyNameUnique(name, company.getId()) ) {
                        throw new NonUniqueCompanyNameException("Компания с именем " + name + " уже существует");
                    }
                    company.setName(request.getName());
                });
        Optional.ofNullable(request.getUrl())
                .ifPresent(company::setUrl);
        Optional.ofNullable(request.getDescription())
                .ifPresent(company::setDescription);
        Optional.ofNullable(request.getPhone())
                .ifPresent(company::setPhone);
        Optional.ofNullable(conversionService.convertToList(request.getIndustryCreateRequestList(), Industry.class))
                .ifPresent(company::setIndustries);
        Optional.ofNullable(request.getResponsibleRmId())
                .ifPresent(responsibleId -> validateResponsibleRM(company, responsibleId));
        return company;
    }

    private void validateResponsibleRM(Company company, Long responsibleId) {
        Employee responsible = employeeRepository.findById(responsibleId);
        if (Boolean.TRUE.equals(responsible.getResponsibleRM())) {
            companyDistributionService.updateDistributionQueue(company, responsible);
            company.setResponsible(responsible);
        } else {
            throw new CrmException("Only participants of request distribution can be set as responsible RM");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Company findCompanyByIdOrThrowException(Long id) {
        return Optional.ofNullable(companyRepository.findOne(id))
                .orElseThrow(() -> new ResourceNotFoundException("Company not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Company> getCompaniesWithFilter(Predicate predicate, Pageable pageable) {
        QCompany qCompany = QCompany.company;
        return companyResponseDtoRepository.findAllWithPageable(Projections.bean(Company.class, qCompany.id, qCompany.name), predicate, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Company findById(Long id) {
        return companyRepository.getOne(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Company> getCompaniesForGlobalSearch(CompanyFilterRequest filterRequest, Pageable pageable) {
        return companyRepository.getCompaniesForGlobalSearch(
                filterRequest.getName(),
                filterRequest.getUrl(),
                filterRequest.getPhone(),
                filterRequest.getResponsibleRmId(),
                filterRequest.getIndustry(),
                pageable
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Company> findByNameFilter(String filter, Pageable pageable) {
        return companyRepository.getCompaniesSortedByNameAndPageable(filter, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Company findCompanyByName(String name) {
        return companyRepository.findCompanyByName(name);
    }

    @Override
    @Transactional(readOnly = true)
    public Company findCompanyByContactId(Contact contact) {
        return companyRepository.findByContactsIsContaining(contact);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean exist(Long id) {
        return companyRepository.exists(id);
    }

    @Override
    public void validateById(Long id) {
        if (!companyRepository.exists(id)) {
            throw new CrmException("Компания с id = " + id + " не найдена");
        }
    }

    private void checkCompanyNameForUnique(String name) {
        if (companyRepository.existsByName(name)) {
            throw new NonUniqueCompanyNameException("Компания с именем " + name + " уже существует");
        }
    }

    private boolean isCompanyNameUnique(String name, Long id) {
        return companyRepository.existsByNameAndIdNot(name, id);
    }

    @Override
    public Page<Company> getPageableCompanies(List<Company> companies, Pageable pageable) {
        List<Company> pagedCompanies = companies.stream()
                .skip((long) pageable.getPageSize() * pageable.getPageNumber())
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());
        return new PageImpl<>(pagedCompanies, pageable, companies.size());
    }

    @Override
    public List<CompanyReport> getCompaniesForReport(LocalDate createDateFrom, LocalDate createDateTo) {
        return exporter.getCompaniesForReport(createDateFrom, createDateTo);
    }

    @Override
    public void checkForDD(Company company) {
        if (company.getResponsible() == null) {
            companyDistributionService.assignDeliveryDirector(company);
        }
    }
}
