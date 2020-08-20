package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.view.ResumeView;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.ResumeViewService;
import com.andersenlab.crm.services.WsSender;
import com.andersenlab.crm.services.i18n.I18nService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import javax.ws.rs.core.MediaType;
import java.time.LocalDateTime;

import static com.andersenlab.crm.rest.controllers.TestConstants.BODY;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ID;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Slf4j
@EnableSpringDataWebSupport
@RunWith(SpringRunner.class)
@WebMvcTest(value = {ResumeViewController.class, CustomExceptionHandler.class}, secure = false)
public class ResumeViewControllerTest {

    private static final String RESUME_VIEW_URL = "/all_resume";

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private WsSender wsSender;
    @MockBean
    private StringToEnumConverterFactory stringToEnumConverterFactory;
    @MockBean
    private ConversionService conversionService;
    @MockBean
    private ResumeViewService resumeViewService;
    @MockBean
    private ReportFile reportFile;
    @MockBean
    private I18nService i18nService;
    @MockBean
    private AuthenticatedUser authenticatedUser;

    @Before
    public void init() {
        when(wsSender.getSender(anyString())).thenReturn(o -> log.info("", o));
    }

    @SneakyThrows
    @Test
    public void whenGetListOfResumeViewResponseThenResponseOk() {
        ResumeView request = new ResumeView();
        request.setCreateDate(LocalDateTime.now());

        mockMvc.perform(get(RESUME_VIEW_URL)
                .content(objectMapper.writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenResumeViewResponseFoundThenOk() {
        mockMvc.perform(get(RESUME_VIEW_URL + "/" + ID)
                .content(BODY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }
}