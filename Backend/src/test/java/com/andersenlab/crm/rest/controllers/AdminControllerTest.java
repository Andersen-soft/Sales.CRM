package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.AdminService;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.i18n.I18nService;
import lombok.SneakyThrows;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@EnableSpringDataWebSupport
@RunWith(SpringRunner.class)
@WebMvcTest(value = {AdminController.class, CustomExceptionHandler.class}, secure = false)
public class AdminControllerTest {

    @MockBean
    private AdminService adminService;
    @MockBean
    private ConversionService conversionService;
    @MockBean
    private StringToEnumConverterFactory stringToEnumConverterFactory;
    @MockBean
    private I18nService i18nService;
    @MockBean
    private AuthenticatedUser authenticatedUser;
    @MockBean
    private CompanySaleTempService companySaleTempService;

    @Autowired
    private MockMvc mvc;

    @SneakyThrows
    @Test
    public void whenCheckTokenThrowCrmExceptionThenReturnResponceCode400() {
        doThrow(new CrmException("Error message")).when(adminService).checkToken(anyString());

        mvc.perform(post("/admin/check-token")
                .content("{\"test\"}")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(RESPONSE_CODE, is(400)));


    }
}
