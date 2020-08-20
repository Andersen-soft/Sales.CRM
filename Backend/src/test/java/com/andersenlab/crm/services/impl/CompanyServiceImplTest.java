package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QCompanySale;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.CompanyRepository;
import com.andersenlab.crm.repositories.CompanyResponseDtoRepositoryCustom;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import com.andersenlab.crm.rest.request.CompanyUpdateRequest;
import com.andersenlab.crm.services.Exporter;
import com.andersenlab.crm.services.distribution.CompanyDDDistributionService;
import com.google.common.collect.ImmutableSet;
import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Matchers;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class CompanyServiceImplTest {
    private static final String COMPANY_NAME = "test";
    private static final Long COMPANY_ID = 1L;
    private static final String COMPANY_DESCRIPTION = "test";
    private static final String UPDATED = "updated";
    private CompanyDDDistributionService companyDistributionService;
    private CompanyRepository companyRepository;
    private CompanyResponseDtoRepositoryCustom companyResponseDtoRepository;
    private ConversionService conversionService;
    private CompanyServiceImpl companyService;
    private EmployeeRepository employeeRepository;
    BooleanExpression booleanExpression;
    PageRequest pageRequest;
    private Exporter exporter;

    @Before
    public void setup() {
        companyDistributionService = mock(CompanyDDDistributionService.class);
        companyRepository = mock(CompanyRepository.class);
        conversionService = mock(ConversionService.class);
        ReportRepository reportRepository = mock(ReportRepository.class);
        companyResponseDtoRepository = mock(CompanyResponseDtoRepositoryCustom.class);
        companyService = new CompanyServiceImpl(
                companyDistributionService,
                companyRepository,
                conversionService,
                reportRepository,
                employeeRepository,
                exporter,
                companyResponseDtoRepository
        );

        Role role = new Role();
        role.setName(RoleEnum.ROLE_SALES);

        Employee employee = new Employee();
        employee.setId(100L);
        employee.setRoles(ImmutableSet.of(role));

        booleanExpression = QCompanySale.companySale.description.contains("er");
        pageRequest = new PageRequest(0, 20);
    }

    @Test
    public void whenCreateCompanyThenRepositorySaveAndFlush() {
        Employee responsible = new Employee();
        responsible.setLogin(UPDATED);
        CompanyCreateRequest request = new CompanyCreateRequest();
        request.setName(COMPANY_NAME);

        Company company = new Company();

        given(conversionService.convert(request, Company.class)).willReturn(company);
        given(companyRepository.findCompanyByName(COMPANY_NAME)).willReturn(null);

        companyService.createCompany(request);

        verify(companyRepository, times(1)).saveAndFlush(company);
    }

    @Test
    public void whenUpdateCompanyThenFieldsUpdated() {
        Employee updatedResponsible = new Employee();
        updatedResponsible.setLogin(UPDATED);

        CompanyUpdateRequest request = new CompanyUpdateRequest();
        request.setDescription(UPDATED);
        request.setName(UPDATED);

        Company stored = new Company();
        stored.setDescription(COMPANY_DESCRIPTION);
        stored.setName(COMPANY_NAME);

        given(companyRepository.findOne(COMPANY_ID)).willReturn(stored);

        companyService.updateCompany(COMPANY_ID, request);

        assertEquals(UPDATED, stored.getDescription());
        assertEquals(UPDATED, stored.getName());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateCompanyAndCompanyNotFoundThenExpectedNotFoundException() {
        given(companyRepository.findOne(COMPANY_ID)).willReturn(null);
        companyService.updateCompany(COMPANY_ID, new CompanyUpdateRequest());
    }

    @Test
    public void whenGetCompanyByIdThenReturnExpectedResponse() {
        Company company = new Company();
        company.setName(COMPANY_NAME);
        given(companyRepository.findOne(COMPANY_ID)).willReturn(company);

        Company companyByID = companyService.findCompanyByIdOrThrowException(COMPANY_ID);

        assertSame(company, companyByID);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenGetCompanyByIdAndCompanyNotFoundThenExpectedNotFoundException() {
        given(companyRepository.findOne(COMPANY_ID)).willReturn(null);
        companyService.findCompanyByIdOrThrowException(COMPANY_ID);
    }

    @Test
    public void whenGetCompaniesWithFilterThenReturnExpectedResponse() {
        List<Company> companyList = new ArrayList<>();
        Page<Company> companyPage = new PageImpl<>(companyList);

        given(companyResponseDtoRepository
                .findAllWithPageable(Matchers.any(), any(Predicate.class), any(Pageable.class)))
                .willReturn(companyPage);

        Page<Company> response =
                companyService.getCompaniesWithFilter(booleanExpression, pageRequest);

        assertEquals(companyList.size(), response.getTotalElements());
    }

    @Test
    public void whenArchiveCompanyThenIsActiveFalseArchiveServiceInvokes() {
        Company companyToArchive = new Company();
        companyToArchive.setIsActive(true);
        CompanyUpdateRequest updateRequest = new CompanyUpdateRequest();

        given(companyRepository.findOne(COMPANY_ID)).willReturn(companyToArchive);
        companyService.updateCompany(COMPANY_ID, updateRequest);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenArchiveCompanyAndNoSuchCompanyThenResourceNotFound() {
        CompanyUpdateRequest updateRequest = new CompanyUpdateRequest();

        given(companyRepository.findOne(COMPANY_ID)).willReturn(null);

        companyService.updateCompany(COMPANY_ID, updateRequest);
    }
}