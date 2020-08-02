package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.converter.StringToEnumConverterFactory;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.rest.facade.ReportFile;
import com.andersenlab.crm.rest.request.ActivityCreateRequest;
import com.andersenlab.crm.rest.request.ActivityUpdateRequest;
import com.andersenlab.crm.rest.response.ActivityResponse;
import com.andersenlab.crm.rest.response.ActivityTypeResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.i18n.I18nService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.querydsl.core.types.Predicate;
import lombok.SneakyThrows;
import org.hamcrest.core.IsNull;
import org.junit.Ignore;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import static com.andersenlab.crm.rest.controllers.TestConstants.DATA;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.ERROR_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_EXCEPTION;
import static com.andersenlab.crm.rest.controllers.TestConstants.NOT_FOUND_MESSAGE;
import static com.andersenlab.crm.rest.controllers.TestConstants.RESPONSE_CODE;
import static com.andersenlab.crm.rest.controllers.TestConstants.SUCCESS;
import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@EnableSpringDataWebSupport
@RunWith(SpringRunner.class)
@WebMvcTest(value = {ActivityController.class, CustomExceptionHandler.class}, secure = false)
public class ActivityControllerTest {

    private static final Long ID = 1L;
    @MockBean
    private ActivityService activityService;
    @MockBean
    private ReportFile reportFile;
    @MockBean
    private StringToEnumConverterFactory converterFactory;
    @MockBean
    private ConversionService conversionService;
    @MockBean
    private I18nService i18nService;
    @MockBean
    private AuthenticatedUser authenticatedUser;

    @Autowired
    private MockMvc mockMvc;
    private String request = "{\"companySaleId\":23,\"types\":[\"Звонок\"]," +
            "\"contacts\":[11],\"dateActivity\":\"%s\",\"description\":\"TEST\"}";

    @SneakyThrows
    @Test
    public void whenGetActivityByIdThenReturnExpectedResponse() {
        ActivityResponse response = new ActivityResponse();
        response.setId(ID);

        given(conversionService.convert(new Activity(), ActivityResponse.class)).willReturn(response);

        mockMvc.perform(get("/activity/get_activity?id=" + ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetActivityByIdThenReturn404StatusCode() {
        given(conversionService.convert(any(Activity.class), any(Class.class))).willThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE));
        given(conversionService.convertWithLocale(any(Activity.class), any(Class.class), any())).willThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE));

        mockMvc.perform(get("/activity/get_activity?id=" + ID)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE, is(NOT_FOUND_EXCEPTION)))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void whenGetFilteredActivitiesThenReturnOkAndDataIsJsonArray() {
        List<Activity> activityList = new ArrayList<>();
        Activity activity = new Activity();
        activityList.add(activity);
        Page page = new PageImpl(activityList);

        given(activityService
                .getActivitiesWithFilter(any(Predicate.class), any(Pageable.class)))
                .willReturn(page);
        given(conversionService
                .convertToList(page.getContent(), ActivityResponse.class))
                .willReturn(Collections.singletonList(new ArrayList<ActivityResponse>()));

        mockMvc.perform(get("/activity/get_activities")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void whenGetTypesThenReturnResponseWithJsonArray() {
        Locale locale = Locale.forLanguageTag(LANGUAGE_TAG_EN);
        List<ActivityTypeResponse> responseList = EnumSet.allOf(Activity.TypeEnum.class).stream()
                .map(v -> ActivityTypeResponse.builder()
                        .ordinal(v.ordinal())
                        .type(v.getName())
                        .typeEnumCode(v.name())
                        .build())
                .collect(Collectors.toList());

        given(activityService.getTypeNames(locale)).willReturn(responseList);

        mockMvc.perform(get("/activity/get_types")
                .header("Accept-Language", LANGUAGE_TAG_EN)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(DATA, hasSize(responseList.size())))
//                .andExpect(jsonPath(DATA, is(responseList)))
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)));
    }

    @SneakyThrows
    @Test
    public void givenInvalidBodyWhenUpdateActivityThenReturn400StatusCode() {
        mockMvc.perform(put("/activity/update_activity?id=" + ID)
                .content(new ObjectMapper().writeValueAsString(new ActivityCreateRequest()))
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(400)));
    }

    @SneakyThrows
    @Test
    public void whenUpdateActivityThenReturn404StatusCode() {
        doThrow(new ResourceNotFoundException(NOT_FOUND_MESSAGE))
                .when(activityService)
                .updateActivity(anyLong(), any(ActivityUpdateRequest.class));
        String createRequest = String.format(request, "2019-06-03T10:15:30");
        mockMvc.perform(put("/activity/update_activity?id=" + ID)
                .content(createRequest)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(DATA).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(404)));
    }

    @SneakyThrows
    @Test
    public void givenValidDateTimeWhenCreateThenSuccess() {
        String createRequest = String.format(request, "2019-06-03T10:15:30");
        doReturn(1L).when(activityService).createActivity(any(ActivityCreateRequest.class));

        mockMvc.perform(post("/activity/create_activity")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(createRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath(SUCCESS).value(true))
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)))
                .andExpect(jsonPath(DATA).value(1L));
    }

    @Ignore("Нарушение имитации рассинхрона времмени вблизи 59 секунды")
    @SneakyThrows
    @Test
    public void givenInvalidDateTimeSecsWhenCreateThenSuccess() {
        String createRequest = String.format(request, LocalDateTime.now().plusSeconds(10));

        doReturn(1L).when(activityService).createActivity(any(ActivityCreateRequest.class));

        mockMvc.perform(post("/activity/create_activity")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(createRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath(SUCCESS).value(true))
                .andExpect(jsonPath(ERROR_CODE).value(IsNull.nullValue()))
                .andExpect(jsonPath(ERROR_MESSAGE).value(IsNull.nullValue()))
                .andExpect(jsonPath(RESPONSE_CODE, is(200)))
                .andExpect(jsonPath(DATA).value(1L));
    }
}