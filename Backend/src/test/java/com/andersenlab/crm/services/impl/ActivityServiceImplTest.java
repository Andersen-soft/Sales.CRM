package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.repositories.ActivityRepository;
import com.andersenlab.crm.repositories.ActivityTypeRepository;
import com.andersenlab.crm.repositories.CompanySaleRepository;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.i18n.I18nService;
import com.querydsl.core.types.Predicate;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
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
import static org.mockito.Mockito.when;

public class ActivityServiceImplTest {

    private static final Long ID = 1L;
    private ActivityRepository activityRepository;
    private ActivityServiceImpl activityService;

    @Before
    public void setUp() {
        ConversionService conversionService = mock(ConversionService.class);
        activityRepository = mock(ActivityRepository.class);
        ActivityTypeRepository activityTypeRepository = mock(ActivityTypeRepository.class);
        AuthenticatedUser authenticatedUser = mock(AuthenticatedUser.class);
        CompanySaleRepository saleRepository = mock(CompanySaleRepository.class);
        ContactRepository contactRepository = mock(ContactRepository.class);
        I18nService i18nService = mock(I18nService.class);
        activityService = new ActivityServiceImpl(
                conversionService,
                activityRepository,
                activityTypeRepository,
                authenticatedUser,
                saleRepository,
                contactRepository,
                i18nService
        );
    }

    @Test
    public void whenGetActivityByIdThenReturnExpectedActivityResponse() {
        Activity activity = new Activity();

        given(activityRepository.findOne(ID)).willReturn(activity);

        Activity found = activityService.getActivityById(ID);

        assertSame(activity, found);
        verify(activityRepository, times(1)).findOne(ID);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenGetActivityByIdThenReturnResourceNotFound() {
        when(activityRepository.findOne(ID)).thenReturn(null);
        activityService.getActivityById(ID);

        verify(activityRepository, times(1)).findOne(ID);
    }

    @Test
    public void whenGetActivitiesWithFilterThenReturnExpectedResponse() {
        List<Activity> activityList = new ArrayList<>();
        Page<Activity> activityPage = new PageImpl<>(activityList);

        given(activityRepository
                .findAll(any(com.querydsl.core.types.Predicate.class), any(Pageable.class)))
                .willReturn(activityPage);

        Page response =
                activityService.getActivitiesWithFilter(any(Predicate.class), any(Pageable.class));

        assertEquals(activityList.size(), response.getTotalElements());
    }
}