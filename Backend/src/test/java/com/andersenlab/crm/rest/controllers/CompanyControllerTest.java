package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.facade.CompanyFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import com.andersenlab.crm.rest.request.CompanyUpdateRequest;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.i18n.I18nService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.core.types.Predicate;
import lombok.SneakyThrows;
import org.hamcrest.core.IsNull;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Matchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static com.andersenlab.crm.rest.controllers.TestConstants.BODY;
import static com.andersenlab.crm.rest.controllers.TestConstants.COMPANY_CREATE_URL;
import static com.andersenlab.crm.rest.controllers.TestConstants.DATA;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_EXCEPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.TEST_DESCRIPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.TEST_FIRST_NAME;
import static com.andersenlab.crm.rest.controllers.TestConstants.TEST_ID;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@EnableSpringDataWebSupport
@RunWith(SpringRunner.class)
@WebMvcTest(value = {CompanyController.class, CustomExceptionHandler.class}, secure = false)
public class CompanyControllerTest {

    @MockBean
    private CompanyService companyService;
    @MockBean
    private CompanyFacade companyFacade;
    @MockBean
    private ConversionService conversionService;
    @MockBean
    private StringToEnumConverterFactory stringToEnumConverterFactory;
    @MockBean
    private I18nService i18nService;
    @MockBean
    private AuthenticatedUser authenticatedUser;

    @Autowired
    private MockMvc mvc;

    @MockBean
    private ReportFile reportFile;

    @SneakyThrows
    @Test
    public void whenCreateCompanyThenResponseOk() {
        CompanyCreateRequest request = new CompanyCreateRequest();
        request.setName(TEST_FIRST_NAME);
        request.setDescription(TEST_DESCRIPTION);
        request.setUrl(TEST_FIRST_NAME);

        mvc.perform(post(COMPANY_CREATE_URL)
                .content(new ObjectMapper().writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenCreateCompanyAndNoNameThen400() {
        CompanyCreateRequest request = new CompanyCreateRequest();
        request.setDescription(TEST_DESCRIPTION);
        request.setUrl(TEST_FIRST_NAME);

        mvc.perform(post(COMPANY_CREATE_URL)
                .content(new ObjectMapper().writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(400)));
    }

    @SneakyThrows
    @Test
    public void whenCreateCompanyAndNoDescriptionThenResponseOk() {
        CompanyCreateRequest request = new CompanyCreateRequest();
        request.setName(TEST_FIRST_NAME);
        request.setUrl(TEST_FIRST_NAME);

        mvc.perform(post(COMPANY_CREATE_URL)
                .content(new ObjectMapper().writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenCreateCompanyAndNotFoundExceptionResponse404() {
        CompanyCreateRequest request = new CompanyCreateRequest();
        request.setName(TEST_FIRST_NAME);
        request.setDescription(TEST_DESCRIPTION);
        request.setUrl(TEST_FIRST_NAME);

        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(companyService).createCompany(any(CompanyCreateRequest.class));

        mvc.perform(post(COMPANY_CREATE_URL)
                .content(new ObjectMapper().writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void whenGetCompanyAndNotFoundExceptionResponse404() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(conversionService).convert(any(Company.class), any(Class.class));

        mvc.perform(get("/company/get_company?id=1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void whenGetFilteredCompaniesThenReturnOkAndDataIsJsonArray() {
        List<Company> companyList = new ArrayList<>();
        Company company = new Company();
        companyList.add(company);
        Page<Company> companyResponseList = new PageImpl<>(companyList);

        given(companyService
                .getCompaniesWithFilter(any(Predicate.class), any(Pageable.class)))
                .willReturn(companyResponseList);

        mvc.perform(get("/company/get_companies?sort=id")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateCompanyThenOk() {
        mvc.perform(put("/company/update_company?id=1")
                .content(BODY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateCompanyAndNotFoundThen404() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(companyService).updateCompany(eq(TEST_ID), Matchers.any(CompanyUpdateRequest.class));

        mvc.perform(put("/company/update_company?id=1")
                .content(BODY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }
}