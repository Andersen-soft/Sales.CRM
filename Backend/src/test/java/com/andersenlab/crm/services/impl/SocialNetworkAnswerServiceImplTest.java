package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.repositories.ActivityRepository;
import com.andersenlab.crm.repositories.CompanyRepository;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.repositories.SocialNetworkAnswerRepository;
import com.andersenlab.crm.repositories.SocialNetworkAnswerSalesHeadViewRepository;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import org.springframework.context.ApplicationEventPublisher;

import static org.mockito.Mockito.mock;

public class SocialNetworkAnswerServiceImplTest {
    private final SocialNetworkAnswerRepository socialNetworkAnswerRepository = mock(SocialNetworkAnswerRepository.class);
    private final SocialNetworkAnswerSalesHeadViewRepository socialNetworkAnswerSalesHeadViewRepository = mock(SocialNetworkAnswerSalesHeadViewRepository.class);
    private final ContactRepository contactRepository = mock(ContactRepository.class);
    private final CompanySaleServiceNew companySaleService = mock(CompanySaleServiceNew.class);
    private final ActivityRepository activityRepository = mock(ActivityRepository.class);
    private final ActivityService activityService = mock(ActivityService.class);
    private final CompanyRepository companyRepository = mock(CompanyRepository.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private final ConversionService conversionService = mock(ConversionService.class);

    private SocialNetworkAnswerServiceImpl socialNetworkAnswerService = new SocialNetworkAnswerServiceImpl(
            socialNetworkAnswerRepository,
            socialNetworkAnswerSalesHeadViewRepository,
            contactRepository,
            companySaleService,
            activityRepository,
            activityService,
            companyRepository,
            eventPublisher,
            conversionService
    );
}
