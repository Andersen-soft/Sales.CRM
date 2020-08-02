package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.rest.sample.HistorySample;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.HistoryService;
import com.andersenlab.crm.services.i18n.I18nService;
import lombok.SneakyThrows;
import org.hamcrest.core.IsNull;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;

import static com.andersenlab.crm.rest.controllers.TestConstants.DATA;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.HISTORY_DESCRIPTION_JSON_PATH;
import static com.andersenlab.crm.rest.controllers.TestConstants.HISTORY_URL;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_EXCEPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.SUCCESS;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(value = {HistoryController.class, CustomExceptionHandler.class}, secure = false)
public class HistoryControllerTest {

    private static final String ESTIMATION_REQUEST_URL = "/estimation_request?id=1";
    private static final String RESUME_REQUEST_URL = "/resume_request?id=1";
    private static final String COMPANY_SALE_URL = "/company_sale?id=1";

    private static final List<HistorySample> samples = new ArrayList<>();

    static {
        HistorySample first = new HistorySample();
        HistorySample second = new HistorySample();
        HistorySample third = new HistorySample();

        first.setDescription("one");
        second.setDescription("two");
        third.setDescription("three");

        samples.add(first);
        samples.add(second);
        samples.add(third);
    }

    @MockBean
    private HistoryService historyService;
    @MockBean
    private StringToEnumConverterFactory stringToEnumConverterFactory;
    @MockBean
    private ConversionService conversionService;
    @MockBean
    private I18nService i18nService;
    @MockBean
    private AuthenticatedUser authenticatedUser;

    @Autowired
    private MockMvc mockMvc;

    @Test
    @SneakyThrows
    public void whenGetResumeRequestHistoryThenOkAndDataIsJsonArray() {
        given(conversionService.convertToList(
                any(List.class), any()))
                .willReturn(samples);

        given(conversionService.convertToListWithLocale(
                any(List.class), any(), any()))
                .willReturn(samples);

        testHistoryMethod(RESUME_REQUEST_URL);
    }

    @Test
    @SneakyThrows
    public void whenGetResumeRequestHistoryAndNoResumeRequestThen404AndSuccessFalse() {
        given(conversionService.convertToList(
                any(List.class), any()))
                .willThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE));

        given(conversionService.convertToListWithLocale(
                any(List.class), any(), any()))
                .willThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE));

        testHistoryMethodWhenException(RESUME_REQUEST_URL);
    }

    @Test
    @SneakyThrows
    public void whenGetCompanySaleHistoryThenOkAndDataIsJsonArray() {
        given(conversionService.convertToList(
                any(List.class), any()))
                .willReturn(samples);

        testHistoryMethod(COMPANY_SALE_URL);
    }

    @Test
    @SneakyThrows
    public void whenGetCompanySaleHistoryAndNoCompanySaleThen404AndSuccessFalse() {
        given(conversionService.convertToList(
                any(List.class), any()))
                .willThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE));

        testHistoryMethodWhenException(COMPANY_SALE_URL);
    }

    @SneakyThrows
    private void testHistoryMethod(String url) {
        mockMvc.perform(get(HISTORY_URL + url)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(DATA, hasSize(3)))
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(SUCCESS).value(true))
                .andExpect(jsonPath(String.format(HISTORY_DESCRIPTION_JSON_PATH, 0), is(samples.get(0).getDescription())))
                .andExpect(jsonPath(String.format(HISTORY_DESCRIPTION_JSON_PATH, 1), is(samples.get(1).getDescription())))
                .andExpect(jsonPath(String.format(HISTORY_DESCRIPTION_JSON_PATH, 2), is(samples.get(2).getDescription())))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    private void testHistoryMethodWhenException(String url) {
        mockMvc.perform(get(HISTORY_URL + url)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(DATA).isEmpty())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(SUCCESS).value(false))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }
}
