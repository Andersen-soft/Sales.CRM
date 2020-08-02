package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.rest.facade.CompanySaleFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.CompanySaleUpdateRequest;
import com.andersenlab.crm.rest.response.CompanySaleResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanySaleReportService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.distribution.CompanySaleNightDistributionService;
import com.andersenlab.crm.services.i18n.I18nService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.core.types.Predicate;
import lombok.SneakyThrows;
import org.hamcrest.core.IsNull;
import org.junit.Test;
import org.junit.runner.RunWith;
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

import static com.andersenlab.crm.rest.controllers.TestConstants.DATA;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ID;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_EXCEPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@EnableSpringDataWebSupport
@RunWith(SpringRunner.class)
@WebMvcTest(value = {CompanySaleController.class, CustomExceptionHandler.class}, secure = false)
public class CompanySaleControllerTest {

    private static final String COMPANY_SALE = "/company_sale";

    @MockBean
    private CompanySaleServiceNew companySaleServiceNew;

    @MockBean
    private CompanySaleReportService reportService;

    @MockBean
    private CompanySaleFacade companySaleFacade;

    @MockBean
    private ReportFile reportFile;

    @MockBean
    private StringToEnumConverterFactory converterFactory;

    @MockBean
    private ConversionService conversionService;

    @MockBean
    private CompanySaleTempService companySaleTempService;

    @MockBean
    private CompanySaleNightDistributionService nightDistributionService;

    @MockBean
    private I18nService i18nService;

    @MockBean
    private AuthenticatedUser authenticatedUser;

    @Autowired
    private MockMvc mockMvc;

    @SneakyThrows
    @Test
    public void whenGetCompanySaleByIdThenReturnExpectedResponse() {
        CompanySaleResponse saleResponse = new CompanySaleResponse();
        saleResponse.setId(ID);

        given(companySaleServiceNew.getCompanySaleResponseById(any())).willReturn(saleResponse);

        mockMvc.perform(get(COMPANY_SALE + "/get_sale?id=" + ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA + ".id").value(saleResponse.getId()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetCompanySaleByIdThenReturnNotFoundException404() {

        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(companySaleServiceNew).getCompanySaleResponseById(any());

        mockMvc.perform(get(COMPANY_SALE + "/get_sale?id=" + ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE).value(404));
    }

    @SneakyThrows
    @Test
    public void whenGetAllSaleStatusesThenReturnResponseWithJsonArray() {
        List<String> responseList = new ArrayList<>();
        CompanySaleResponse saleResponse = new CompanySaleResponse();
        saleResponse.setId(ID);
        saleResponse.setStatus("status");
        responseList.add(saleResponse.getStatus());

        given(companySaleServiceNew.getStatuses()).willReturn(responseList);

        mockMvc.perform(get(COMPANY_SALE + "/get_statuses")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.notNullValue()))
                .andExpect(jsonPath(DATA, hasSize(responseList.size())))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetFilteredCompaniesSalesThenReturnOkAndDataIsJsonArray() {
        List<CompanySaleResponse> saleResponseList = new ArrayList<>();
        CompanySaleResponse companyResponse = new CompanySaleResponse();
        saleResponseList.add(companyResponse);

        Page<CompanySaleResponse> response = new PageImpl<>(saleResponseList);

        given(companySaleFacade
                .getCompanySales(any(Predicate.class), any(Pageable.class)))
                .willReturn(response);

        mockMvc.perform(get(COMPANY_SALE + "?sort=id")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(DATA + ".content", hasSize(1)))
                .andExpect(jsonPath(DATA + ".content[0].id").value(companyResponse.getId()))
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateCompanySaleAndNotFoundThen404() {
        CompanySaleUpdateRequest companySaleUpdateRequest = new CompanySaleUpdateRequest();
        companySaleUpdateRequest.setWeight(1L);
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE)).when(companySaleFacade).updateCompanySale(any(Long.class), any(CompanySaleUpdateRequest.class));

        mockMvc.perform(put(COMPANY_SALE + "/update_sale?id=1")
                .content(new ObjectMapper().writeValueAsString(companySaleUpdateRequest))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }
}
