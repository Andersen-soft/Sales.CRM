package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.facade.ContactFacade;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.facade.SourceFacade;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import com.andersenlab.crm.rest.request.ContactUpdateRequest;
import com.andersenlab.crm.rest.response.ContactResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.ContactService;
import com.andersenlab.crm.services.SourceService;
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

import java.util.Collections;
import java.util.List;

import static com.andersenlab.crm.rest.controllers.TestConstants.BODY;
import static com.andersenlab.crm.rest.controllers.TestConstants.CONTACT_CREATE_URL;
import static com.andersenlab.crm.rest.controllers.TestConstants.DATA;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ID;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_EXCEPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.TEST_EMAIL;
import static com.andersenlab.crm.rest.controllers.TestConstants.TEST_FIRST_NAME;
import static com.andersenlab.crm.rest.controllers.TestConstants.TEST_LAST_NAME;
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
@WebMvcTest(value = {ContactController.class, CustomExceptionHandler.class}, secure = false)
public class ContactControllerTest {

    @MockBean
    private ContactService contactService;
    @MockBean
    private SourceService sourceService;
    @MockBean
    private ContactFacade contactFacade;
    @MockBean
    private SourceFacade sourceFacade;
    @MockBean
    private StringToEnumConverterFactory stringToEnumConverterFactory;
    @MockBean
    private ConversionService conversionService;
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
    public void whenCreateContactThenResponseOk() {
        ContactCreateRequest request = new ContactCreateRequest();
        request.setCompanyId(ID);
        request.setCountryId(ID);
        request.setSocialNetworkUserId(ID);
        request.setFirstName(TEST_FIRST_NAME);
        request.setSourceId(ID);
        request.setSex(Sex.MALE);

        mvc.perform(post(CONTACT_CREATE_URL)
                .content(new ObjectMapper().writeValueAsString(request))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(0))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenCreateContactAndNoCompanyThen400() {
        ContactCreateRequest request = new ContactCreateRequest();
        request.setFirstName(null);
        request.setLastName(TEST_LAST_NAME);
        request.setEmail(TEST_EMAIL);
        request.setSex(Sex.MALE);

        doThrow(new CrmException(NOT_FOUND_MESSAGE))
                .when(contactService).createContact(any(ContactCreateRequest.class));

        mvc.perform(post(CONTACT_CREATE_URL)
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
    public void whenCreateContactAndNoNameThen400() {
        ContactCreateRequest request = new ContactCreateRequest();
        request.setLastName(TEST_LAST_NAME);
        request.setCompanyId(ID);
        request.setEmail(TEST_EMAIL);
        request.setSex(Sex.MALE);

        mvc.perform(post(CONTACT_CREATE_URL)
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
    public void whenCreateContactAndNoSecondNameThen400() {
        ContactCreateRequest request = new ContactCreateRequest();
        request.setFirstName(null);
        request.setCompanyId(ID);
        request.setEmail(TEST_EMAIL);
        request.setSex(Sex.MALE);

        mvc.perform(post(CONTACT_CREATE_URL)
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
    public void whenCreateCompanyAndNoEmailThen400() {
        ContactCreateRequest request = new ContactCreateRequest();
        request.setFirstName(null);
        request.setLastName(TEST_LAST_NAME);
        request.setCompanyId(ID);
        request.setSex(Sex.MALE);

        mvc.perform(post(CONTACT_CREATE_URL)
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
    public void whenGetContactThenReturnExpected() {
        ContactResponse response = new ContactResponse();
        response.setFirstName(TEST_FIRST_NAME);
        response.setLastName(TEST_LAST_NAME);
        response.setEmail(TEST_EMAIL);

        ContactResponse contactResponse = new ContactResponse();
        contactResponse.setFirstName(TEST_FIRST_NAME);

        given(conversionService.convertWithLocale(any(Contact.class), any(), any())).willReturn(response);

        mvc.perform(get("/contact/get_contact?id=1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA + ".firstName").value(TEST_FIRST_NAME))
                .andExpect(jsonPath(DATA + ".lastName").value(TEST_LAST_NAME))
                .andExpect(jsonPath(DATA + ".email").value(TEST_EMAIL))
                .andExpect(jsonPath(ERROR_MESSAGE).value(nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetContactAndNotFoundExceptionResponse404() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(conversionService).convertWithLocale(any(Contact.class), any(), any());

        mvc.perform(get("/contact/get_contact?id=1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(nullValue()))
                .andExpect(jsonPath(DATA).value(nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void whenGetFilteredContactsThenReturnOkAndDataIsJsonArray() {
        Contact contactResponse = new Contact();
        List<Contact> responseList = Collections.singletonList(contactResponse);
        Page<Contact> response = new PageImpl<>(responseList);

        given(contactService
                .getContactsWithFilter(any(Predicate.class), any(Pageable.class)))
                .willReturn(response);

        mvc.perform(get("/contact/get_contacts?sort=isActive")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateContactThenOk() {
        mvc.perform(put("/contact/update_contact?id=1")
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
    public void whenUpdateContactAndNotFoundThen404() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(contactService).updateContact(eq(1L), Matchers.any(ContactUpdateRequest.class));

        mvc.perform(put("/contact/update_contact?id=1")
                .content(BODY)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(NOT_FOUND_EXCEPTION))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }
}
