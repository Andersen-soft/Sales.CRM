package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EstimationRequest;
import com.andersenlab.crm.model.entities.EstimationRequestComment;
import com.andersenlab.crm.rest.facade.EstimationRequestFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.EstimationRequestCreate;
import com.andersenlab.crm.rest.request.EstimationRequestUpdate;
import com.andersenlab.crm.rest.response.CommentResponse;
import com.andersenlab.crm.rest.response.EstimationRequestResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CommentService;
import com.andersenlab.crm.services.EstimationRequestService;
import com.andersenlab.crm.services.WsSender;
import com.andersenlab.crm.services.i18n.I18nService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.hamcrest.Matchers;
import org.hamcrest.core.IsNull;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

import static com.andersenlab.crm.rest.controllers.TestConstants.BODY;
import static com.andersenlab.crm.rest.controllers.TestConstants.DATA;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ID;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_EXCEPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.SUCCESS;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.core.IsNull.nullValue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(value = {EstimationRequestController.class, CustomExceptionHandler.class}, secure = false)
public class EstimationRequestControllerTest {

    private static final String ESTIMATION_REQUEST_URL = "/estimation_requests";

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private StringToEnumConverterFactory stringToEnumConverterFactory;

    @MockBean
    private EstimationRequestService estimationRequestService;

    @MockBean
    private EstimationRequestFacade estimationRequestFacade;

    @MockBean
    private CommentService commentService;

    @MockBean
    private ReportFile reportFileService;

    @MockBean
    private ConversionService conversionService;

    @MockBean
    private WsSender wsSender;

    @MockBean
    private I18nService i18nService;

    @MockBean
    private AuthenticatedUser authenticatedUser;

    @Autowired
    private MockMvc mockMvc;

    @Before
    public void init() {
        when(wsSender.getSender(anyString())).thenReturn(System.out::println);
    }

    @SneakyThrows
    @Test
    public void whenCreateRequestThenResponseOk() {
        EstimationRequestCreate request = new EstimationRequestCreate();
        request.setCompanyId(1L);
        request.setDeadline(LocalDate.now());
        request.setName("description");
        request.setComment("comment");
        request.setCompanySale(1L);
        MockMultipartFile jsonFile = new MockMultipartFile("json", "",
                "application/json", objectMapper.writeValueAsString(request).getBytes());
        MockMultipartFile dataFile = new MockMultipartFile("files", "", "", new byte[]{});
        given(conversionService.convert(any(EstimationRequest.class), any())).willReturn(new EstimationRequestResponse());
        mockMvc.perform(fileUpload(ESTIMATION_REQUEST_URL)
                .file(jsonFile)
                .file(dataFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(SUCCESS).value(true))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenCreateRequestValidationFailedForPriorityThenReturn400StatusCode() {
        EstimationRequestCreate request = new EstimationRequestCreate();
        request.setCompanyId(1L);
        request.setDeadline(LocalDate.now());
        request.setComment("comment");
        request.setCompanySale(1L);
        MockMultipartFile jsonFile = new MockMultipartFile("json", "",
                "application/json", objectMapper.writeValueAsString(request).getBytes());
        MockMultipartFile dataFile = new MockMultipartFile("file", "", "", new byte[]{});
        MultipartFile[] multipartMassive = {dataFile};
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(estimationRequestService)
                .createRequest(request, multipartMassive);
        mockMvc.perform(fileUpload(ESTIMATION_REQUEST_URL)
                .file(jsonFile)
                .file(dataFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_MESSAGE).value("Validation failed for:" +
                        " field: name, rejected value: null, cause: must not be null"))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(400)));
    }

    @SneakyThrows
    @Test
    public void whenGetRequestThenResponseOk() {
        EstimationRequest request = new EstimationRequest();
        given(estimationRequestService.getActiveRequestById(ID)).willReturn(request);
        mockMvc.perform(get(ESTIMATION_REQUEST_URL + "/" + ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetRequestThenThenReturn404StatusCode() {
        given(conversionService.convert(any(EstimationRequest.class), any()))
                .willThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE));
        mockMvc.perform(get(ESTIMATION_REQUEST_URL + "/" + ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(404)));
    }

    @SneakyThrows
    @Test
    public void whenGetStatusesThenReturnResponseWithJsonArray() {
        mockMvc.perform(get(ESTIMATION_REQUEST_URL + "/statuses")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(DATA).isArray())
                .andExpect(jsonPath(DATA, hasSize(0)))
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(notNullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateRequestThenReturnExpectedResponse() {
        EstimationRequestUpdate requestUpdate = new EstimationRequestUpdate();
        requestUpdate.setDeadLine(LocalDate.now());
        mockMvc.perform(put(ESTIMATION_REQUEST_URL + "/" + ID)
                .content(objectMapper.writeValueAsString(requestUpdate))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateRequestThenReturn404StatusCode() {
        EstimationRequestUpdate update = new EstimationRequestUpdate();
        update.setDeadLine(LocalDate.now());
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(estimationRequestService)
                .updateRequest(anyLong(), any(EstimationRequestUpdate.class));
        mockMvc.perform(put(ESTIMATION_REQUEST_URL + "/" + ID)
                .content(objectMapper.writeValueAsString(update))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void whenDeleteRequestThenOk() {
        mockMvc.perform(delete(ESTIMATION_REQUEST_URL + "/" + ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenDetachFileToEstimationThenOk() {
        mockMvc.perform(delete(ESTIMATION_REQUEST_URL + "/" + ID + "/attachments/" + ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(200)));
    }

    @SneakyThrows
    @Test
    public void whenDetachFileToEstimationThenResourceNotFound404() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(estimationRequestService).detachFile(any(Long.class), any(Long.class));
        mockMvc.perform(delete(ESTIMATION_REQUEST_URL + "/" + ID + "/attachments/" + ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, Matchers.is(404)));
    }

    @SneakyThrows
    @Test
    public void whenAttachFileToEstimationThenResponseOk() {
        MockMultipartFile dataFile = new MockMultipartFile("file", "file", "", new byte[]{});
        mockMvc.perform(fileUpload(ESTIMATION_REQUEST_URL + "/" + ID + "/attachments")
                .file(dataFile)
                .param("id", String.valueOf(ID)))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).isArray())
                .andExpect(jsonPath(DATA).isEmpty())
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenAttachFileToEstimationThenReturnCrmExeption() {
        MockMultipartFile dataFile = new MockMultipartFile("file", "", "", new byte[]{});
        doThrow(new CrmException(NOT_FOUND_MESSAGE))
                .when(conversionService).convertToList(any(Iterable.class), any());

        Employee mockedEmployee = new Employee();
        mockedEmployee.setEmployeeLang(LANGUAGE_TAG_EN);
        doReturn(mockedEmployee).when(authenticatedUser).getCurrentEmployee();

        doReturn(NOT_FOUND_MESSAGE)
                .when(i18nService).getLocalizedMessage(any(), any());

        mockMvc.perform(fileUpload(ESTIMATION_REQUEST_URL + "/" + ID + "/attachments")
                .file(dataFile)
                .param("id", String.valueOf(ID)))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(400)));
    }

    @SneakyThrows
    @Test
    public void whenCommentNotFoundThenSuccessFalseAndResponseCode404() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(commentService)
                .getComment(org.mockito.Matchers.anyLong(), org.mockito.Matchers.anyLong());
        mockMvc.perform(get(ESTIMATION_REQUEST_URL + "/" + ID + "/comments/" + ID)
                .content(BODY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(SUCCESS).value(false))
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(notNullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void whenCommentFoundThenOk() {
        doReturn(new CommentResponse())
                .when(conversionService)
                .convert(new EstimationRequestComment(), CommentResponse.class);
        mockMvc.perform(get(ESTIMATION_REQUEST_URL + "/" + ID + "/comments/" + ID)
                .content(BODY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenAddCommentThenOk() {
        mockMvc.perform(post(ESTIMATION_REQUEST_URL + "/" + ID + "/comments")
                .content(BODY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }
}
