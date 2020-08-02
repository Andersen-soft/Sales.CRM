package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.rest.dto.resumerequest.ResumeRequestDtoUpdate;
import com.andersenlab.crm.rest.facade.ResumeFacade;
import com.andersenlab.crm.rest.facade.ResumeRequestFacade;
import com.andersenlab.crm.rest.request.ResumeRequestCreateRequest;
import com.andersenlab.crm.rest.request.ResumeRequestUpdateRequest;
import com.andersenlab.crm.rest.response.ResumeRequestDto;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.FileUploaderHelper;
import com.andersenlab.crm.services.ResumeRequestService;
import com.andersenlab.crm.services.i18n.I18nService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.core.types.Predicate;
import lombok.SneakyThrows;
import org.hamcrest.Matchers;
import org.hamcrest.core.IsNull;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.config.EnableSpringDataWebSupport;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static com.andersenlab.crm.model.entities.ResumeRequest.Priority.MAJOR;
import static com.andersenlab.crm.rest.controllers.TestConstants.DATA;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_EXCEPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@EnableSpringDataWebSupport
@RunWith(SpringRunner.class)
@WebMvcTest(value = {ResumeRequestController.class, CustomExceptionHandler.class}, secure = false)
public class ResumeRequestControllerTest {

    private static final String RESUME_REQUEST_URL = "/resume_request";
    @Autowired
    private ObjectMapper objectMapper;
    @MockBean
    private StringToEnumConverterFactory stringToEnumConverterFactory;
    @MockBean
    private ResumeRequestService resumeRequestService;
    @MockBean
    private ResumeFacade resumeFacade;
    @MockBean
    private FileUploaderHelper fileUploaderHelper;
    @MockBean
    private ResumeRequestFacade resumeRequestFacade;
    @MockBean
    private ConversionService conversionService;
    @MockBean
    private I18nService i18nService;
    @MockBean
    private AuthenticatedUser authenticatedUser;
    @Autowired
    private MockMvc mockMvc;

    @SneakyThrows
    @Test
    public void whenCreateRequestThenResponseOk() {
        ResumeRequestCreateRequest request = new ResumeRequestCreateRequest();
        request.setCompanyId(1L);
        request.setDeadline(LocalDate.now());
        request.setPriority(String.valueOf(MAJOR));
        request.setName("some name");
        request.setCompanySale(1L);
        MockMultipartFile jsonFile = new MockMultipartFile("json", "",
                "application/json", objectMapper.writeValueAsString(request).getBytes());
        MockMultipartFile dataFile = new MockMultipartFile("files", "", "", new byte[]{});

        MultipartFile[] multipartMassive = {dataFile};

        ResumeRequestDto resumeRequestDto = new ResumeRequestDto();

        given(resumeRequestFacade.create(request, multipartMassive)).willReturn(resumeRequestDto);

        mockMvc.perform(
                fileUpload(RESUME_REQUEST_URL)
                        .file(jsonFile)
                        .file(dataFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenCreateRequestThenThenReturn400StatusCode() {
        MultipartFile[] file = new MultipartFile[]{};
        ResumeRequestCreateRequest request = new ResumeRequestCreateRequest();
        request.setDeadline(LocalDate.now());

        String prefixId = "estimationrequest/100";
        given(fileUploaderHelper.uploadFilesAndGetEntities(prefixId, file)).willThrow(new CrmException(NOT_FOUND_MESSAGE));

        MockMultipartFile jsonFile = new MockMultipartFile("json", "",
                "application/json", objectMapper.writeValueAsString(request).getBytes());
        MockMultipartFile dataFile = new MockMultipartFile("file", "", "", new byte[]{});

        mockMvc.perform(fileUpload(RESUME_REQUEST_URL)
                .file(jsonFile)
                .file(dataFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_MESSAGE).value(notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(400)));
    }

    @SneakyThrows
    @Test
    public void whenGetRequestThenResponseOk() {

        ResumeRequestCreateRequest request = new ResumeRequestCreateRequest();

        mockMvc.perform(get(RESUME_REQUEST_URL + "/1")
                .content(new ObjectMapper().writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetRequestThenThenReturn404StatusCode() {
        given(resumeRequestFacade.getByID(1L)).willThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE));

        mockMvc.perform(get(RESUME_REQUEST_URL + "/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(404)));
    }

    @SneakyThrows
    @Test
    public void whenGetPrioritiesThenReturnResponseWithJsonArray() {
        mockMvc.perform(get(RESUME_REQUEST_URL + "/get_priorities")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(notNullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetStatusesThenReturnResponseWithJsonArray() {
        mockMvc.perform(get(RESUME_REQUEST_URL + "/get_statuses")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.notNullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetResumeRequestsThenReturnOkAndDataIsJsonArray() {
        ResumeRequestDto resumeRequest = new ResumeRequestDto();
        List<ResumeRequestDto> list = new ArrayList<>();
        list.add(resumeRequest);
        Page<ResumeRequestDto> response = new PageImpl<>(list, new PageRequest(1, 20), list.size());

        given(resumeRequestFacade
                .get(any(Predicate.class), any(Pageable.class)))
                .willReturn(response);

        mockMvc.perform(get(RESUME_REQUEST_URL)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateRequestThenReturnExpectedResponse() {
        mockMvc.perform(put(RESUME_REQUEST_URL + "/1")
                .content(new ObjectMapper().writeValueAsString(new ResumeRequestUpdateRequest()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateActivityThenReturn404StatusCode() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(resumeRequestFacade)
                .update(any(Long.class), any(ResumeRequestDtoUpdate.class));

        mockMvc.perform(put(RESUME_REQUEST_URL + "/1")
                .content(new ObjectMapper().writeValueAsString(new ResumeRequestUpdateRequest()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void whenDeleteRequestThenOk() {
        mockMvc.perform(delete(RESUME_REQUEST_URL + "/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenDeleteRequestAndNoRequestThen404() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(resumeRequestFacade)
                .delete(1L);

        mockMvc.perform(delete(RESUME_REQUEST_URL + "/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(404)));
    }
}
