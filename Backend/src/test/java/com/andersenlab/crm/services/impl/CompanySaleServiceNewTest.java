package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.configuration.properties.TelegramProperties;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.events.CompanySaleAssignedEmailEmployeeNotifierEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.repositories.CompanySaleHistoryRepository;
import com.andersenlab.crm.repositories.CompanySaleRepository;
import com.andersenlab.crm.repositories.CompanySaleTempRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.SaleRequestService;
import com.andersenlab.crm.services.TelegramService;
import com.andersenlab.crm.services.distribution.CompanyDDDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleDayDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleNightDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleRegionalDistributionService;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Arrays;
import java.util.Collections;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.internal.verification.VerificationModeFactory.times;

public class CompanySaleServiceNewTest {
    private static final String NOT_IN_DISTRIBUTION_DESCRIPTION = "not in distribution";

    private final CompanySaleRepository companySaleRepository = mock(CompanySaleRepository.class);
    private final CompanySaleTempRepository companySaleTempRepository = mock(CompanySaleTempRepository.class);
    private final CompanySaleHistoryRepository historyRepository = mock(CompanySaleHistoryRepository.class);
    private final SaleRequestService saleRequestService = mock(SaleRequestService.class);
    private final CompanySaleTempService companySaleTempService = mock(CompanySaleTempService.class);
    private final CompanySaleGoogleAdRecordService googleAdRecordService = mock(CompanySaleGoogleAdRecordService.class);
    private final CompanyDDDistributionService companyDistributionService = mock(CompanyDDDistributionService.class);
    private final CompanySaleRegionalDistributionService regionalDistributionService = mock(CompanySaleRegionalDistributionService.class);
    private final CompanySaleDayDistributionService dayDistributionService = mock(CompanySaleDayDistributionService.class);
    private final CompanySaleNightDistributionService nightDistributionService = mock(CompanySaleNightDistributionService.class);
    private final TelegramService telegramService = mock(TelegramService.class);
    private final AuthenticatedUser authenticatedUser = mock(AuthenticatedUser.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private final ApplicationProperties applicationProperties = mock(ApplicationProperties.class);
    private final TelegramProperties telegramProperties = mock(TelegramProperties.class);
    private final ConversionService conversionService = mock(ConversionService.class);

    private final CompanySaleServiceNew companySaleServiceNew = new CompanySaleServiceNewImpl(
            companySaleRepository,
            companySaleTempRepository,
            historyRepository,
            companySaleTempService,
            googleAdRecordService,
            saleRequestService,
            companyDistributionService,
            dayDistributionService,
            nightDistributionService,
            regionalDistributionService,
            telegramService,
            authenticatedUser,
            eventPublisher,
            applicationProperties,
            telegramProperties,
            conversionService
    );

    private Employee currentEmployee;
    private Employee regionalResponsible;
    private Employee crmBot;
    private Employee salesHead;
    private Company company;
    private Company secondCompany;
    private Company recommendationCompany;

    private Contact contactWithRegionalCountry;
    private Contact contactWithoutRegionalCountry;
    private Contact contactForSecondCompany;
    private Contact contactForRecommendationCompany;

    private CompanySale notInDistribution;
    private CompanySale salesHeadResponsible;

    private Source sourceMail;
    private Source sourceContact;

    @Before
    public void setUpEntities() {
        when(companySaleRepository.saveAndFlush(any(CompanySale.class)))
                .thenAnswer(a -> a.getArguments()[0]);
        company = new Company();
        company.setId(1L);
        company.setName("company");
        company.setContacts(Arrays.asList(contactWithoutRegionalCountry, contactWithRegionalCountry));

        secondCompany = new Company();
        secondCompany.setId(2L);
        secondCompany.setName("second company");
        secondCompany.setContacts(Collections.singletonList(contactForSecondCompany));

        recommendationCompany = new Company();
        recommendationCompany.setId(3L);
        recommendationCompany.setName("recommendation company");
        recommendationCompany.setContacts(Collections.singletonList(contactForRecommendationCompany));

        Role roleSales = new Role();
        roleSales.setName(RoleEnum.ROLE_SALES);
        roleSales.setId(1L);

        Role roleSite = new Role();
        roleSite.setName(RoleEnum.ROLE_SITE);
        roleSite.setId(2L);

        Role roleSalesHead = new Role();
        roleSalesHead.setId(3L);
        roleSalesHead.setName(RoleEnum.ROLE_SALES_HEAD);

        String forCurrent = "sales";
        currentEmployee = new Employee();
        currentEmployee.setId(1L);
        currentEmployee.setLogin(forCurrent);
        currentEmployee.setEmail(forCurrent);
        currentEmployee.setRoles(Collections.singleton(roleSales));
        when(authenticatedUser.getCurrentEmployee()).thenReturn(currentEmployee);

        String forCrmBot = "site";
        crmBot = new Employee();
        crmBot.setId(2L);
        crmBot.setLogin(forCrmBot);
        crmBot.setEmail(forCrmBot);
        crmBot.setRoles(Collections.singleton(roleSite));
        when(authenticatedUser.getCurrentEmployee()).thenReturn(currentEmployee);

        Country regionalCountry = new Country();
        regionalCountry.setId(1L);
        regionalCountry.setNameEn("regional");

        Country nonRegionalCountry = new Country();
        regionalCountry.setId(2L);
        regionalCountry.setNameEn("nonRegional");

        String forRegional = "regional";
        regionalResponsible = new Employee();
        regionalResponsible.setId(3L);
        regionalResponsible.setLogin(forRegional);
        regionalResponsible.setEmail(forRegional);
        regionalResponsible.setRoles(Collections.singleton(roleSales));
        regionalResponsible.setCountries(Collections.singleton(regionalCountry));

        String forSalesHead = "salesHead";
        salesHead = new Employee();
        salesHead.setId(4L);
        salesHead.setLogin(forSalesHead);
        salesHead.setEmail(forSalesHead);
        salesHead.setRoles(Collections.singleton(roleSalesHead));

        sourceMail = new Source();
        sourceMail.setId(1L);
        sourceMail.setName("mail");

        sourceContact = new Source();
        sourceContact.setId(2L);
        sourceContact.setName("personal contact");

        contactWithRegionalCountry = new Contact();
        contactWithRegionalCountry.setId(1L);
        contactWithRegionalCountry.setFirstName("regional contact");
        contactWithRegionalCountry.setCountry(regionalCountry);
        contactWithRegionalCountry.setCompany(company);

        contactWithoutRegionalCountry = new Contact();
        contactWithoutRegionalCountry.setId(2L);
        contactWithoutRegionalCountry.setFirstName("non-regional contact");
        contactWithoutRegionalCountry.setCountry(nonRegionalCountry);
        contactWithoutRegionalCountry.setCompany(company);

        contactForSecondCompany = new Contact();
        contactForSecondCompany.setId(3L);
        contactForSecondCompany.setFirstName("second company contact");
        contactForSecondCompany.setCountry(nonRegionalCountry);
        contactForSecondCompany.setCompany(secondCompany);

        contactForRecommendationCompany = new Contact();
        contactForRecommendationCompany.setId(4L);
        contactForRecommendationCompany.setFirstName("recommendation company contact");
        contactForRecommendationCompany.setCountry(nonRegionalCountry);
        contactForRecommendationCompany.setCompany(recommendationCompany);

        when(regionalDistributionService.findNextRegionalEmployeeByCountry(regionalCountry))
                .thenReturn(regionalResponsible);

        notInDistribution = new CompanySale();
        notInDistribution.setId(42L);
        notInDistribution.setCompany(company);
        notInDistribution.setMainContact(contactWithoutRegionalCountry);
        notInDistribution.setResponsible(currentEmployee);
        notInDistribution.setDescription(NOT_IN_DISTRIBUTION_DESCRIPTION);
        notInDistribution.setStatus(CompanySale.Status.LEAD);
        notInDistribution.setSource(sourceMail);

        CompanySale inDistribution = new CompanySale();
        inDistribution.setId(43L);
        inDistribution.setCompany(company);
        inDistribution.setMainContact(contactWithoutRegionalCountry);
        inDistribution.setResponsible(crmBot);
        inDistribution.setTimeStatus(CompanySaleTemp.Status.DAY);
        inDistribution.setInDayAutoDistribution(true);
        inDistribution.setDescription("in day distribution holy s#&t");
        inDistribution.setStatus(CompanySale.Status.LEAD);
        inDistribution.setSource(sourceMail);

        salesHeadResponsible = new CompanySale();
        salesHeadResponsible.setId(44L);
        salesHeadResponsible.setCompany(company);
        salesHeadResponsible.setMainContact(contactWithoutRegionalCountry);
        salesHeadResponsible.setResponsible(currentEmployee);
        salesHeadResponsible.setDescription(NOT_IN_DISTRIBUTION_DESCRIPTION);
        salesHeadResponsible.setStatus(CompanySale.Status.LEAD);
        salesHeadResponsible.setSource(sourceMail);

        when(companySaleRepository.getOne(42L)).thenReturn(notInDistribution);
        when(companySaleRepository.getOne(43L)).thenReturn(inDistribution);
        when(companySaleRepository.getOne(44L)).thenReturn(salesHeadResponsible);


        when(companySaleTempService.defineCompanySaleTempStatus())
                .thenReturn(CompanySaleTemp.Status.DAY);
    }

    @Test
    public void whenFindSaleByIdThenSuccess() {
        CompanySale actual = companySaleServiceNew.findById(42L);
        assertEquals(notInDistribution, actual);
    }

    @Test
    public void whenFindSaleByIdThenReturnNull() {
        CompanySale actual = companySaleServiceNew.findById(9000L);
        assertNull(actual);
    }

    @Test
    public void whenCreateCompanySaleThenSuccess() {
        CompanySale companySale = new CompanySale();
        companySale.setId(1L);
        companySale.setResponsible(currentEmployee);
        companySale.setCompany(company);
        companySale.setMainContact(contactWithoutRegionalCountry);
        companySale.setStatus(CompanySale.Status.LEAD);
        companySale.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.createSale(companySale);
        assertEquals(companySale, actual);
    }

    @Test
    public void whenCreateCompanySaleWithBotResponsibleThenSaleToAutoDistribution() {
        CompanySale companySale = new CompanySale();
        companySale.setId(1L);
        companySale.setResponsible(crmBot);
        companySale.setCompany(company);
        companySale.setMainContact(contactWithoutRegionalCountry);
        companySale.setStatus(CompanySale.Status.LEAD);
        companySale.setSource(sourceMail);

        when(companySaleTempService.defineCompanySaleTempStatus())
                .thenReturn(CompanySaleTemp.Status.DAY);

        CompanySale expected = new CompanySale();
        expected.setId(1L);
        expected.setResponsible(crmBot);
        expected.setCompany(company);
        expected.setMainContact(contactWithoutRegionalCountry);
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setTimeStatus(CompanySaleTemp.Status.DAY);
        expected.setInDayAutoDistribution(true);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.createSale(companySale);
        assertEquals(expected, actual);
        verify(companySaleTempService, times(1))
                .createCompanySaleTempAndNotifier(companySale);
    }

    @Test
    public void whenCreateCompanySaleWithBotResponsibleThenSaleToRegionalDistribution() {
        CompanySale companySale = new CompanySale();
        companySale.setId(1L);
        companySale.setResponsible(crmBot);
        companySale.setCompany(company);
        companySale.setMainContact(contactWithRegionalCountry);
        companySale.setStatus(CompanySale.Status.LEAD);
        companySale.setSource(sourceMail);

        CompanySale expected = new CompanySale();
        expected.setId(1L);
        expected.setResponsible(regionalResponsible);
        expected.setCompany(company);
        expected.setMainContact(contactWithRegionalCountry);
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setTimeStatus(CompanySaleTemp.Status.REGIONAL);
        expected.setInDayAutoDistribution(false);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.createSale(companySale);
        assertEquals(expected, actual);
        verify(companySaleTempService, times(0))
                .createCompanySaleTempAndNotifier(companySale);
    }

    @Test
    public void whenCreateCompanySaleWithBotResponsibleAndStatusArchiveThenNoDistribution() {
        CompanySale companySale = new CompanySale();
        companySale.setId(1L);
        companySale.setResponsible(crmBot);
        companySale.setCompany(company);
        companySale.setMainContact(contactWithoutRegionalCountry);
        companySale.setStatus(CompanySale.Status.ARCHIVE);
        companySale.setSource(sourceMail);

        when(companySaleTempService.defineCompanySaleTempStatus())
                .thenReturn(CompanySaleTemp.Status.DAY);

        CompanySale expected = new CompanySale();
        expected.setId(1L);
        expected.setResponsible(crmBot);
        expected.setCompany(company);
        expected.setMainContact(contactWithoutRegionalCountry);
        expected.setStatus(CompanySale.Status.ARCHIVE);
        expected.setInDayAutoDistribution(false);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.createSale(companySale);
        assertEquals(expected, actual);
        verify(companySaleTempService, times(0))
                .createCompanySaleTempAndNotifier(companySale);
    }

    @Test
    public void whenUpdateSaleAndResponsibleIsCurrentEmployeeThenSuccessAndUpdateRequests() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(company);
        updatedSale.setMainContact(contactWithRegionalCountry);
        updatedSale.setResponsible(regionalResponsible);
        updatedSale.setDescription("not in distribution updated v1");
        updatedSale.setStatus(CompanySale.Status.OPPORTUNITY);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(company);
        expected.setMainContact(contactWithRegionalCountry);
        expected.setResponsible(regionalResponsible);
        expected.setDescription("not in distribution updated v1");
        expected.setStatus(CompanySale.Status.OPPORTUNITY);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);

        expected.setStatusChangedDate(actual.getStatusChangedDate());
        expected.setCreateLeadDate(actual.getCreateLeadDate());
        assertEquals(expected, actual);
        verify(saleRequestService, Mockito.times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateSaleAndCurrentEmployeeIsSalesHeadThenSuccessAndUpdateRequests() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(salesHead);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(company);
        updatedSale.setMainContact(contactWithRegionalCountry);
        updatedSale.setResponsible(regionalResponsible);
        updatedSale.setDescription("not in distribution updated v2");
        updatedSale.setStatus(CompanySale.Status.OPPORTUNITY);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(company);
        expected.setMainContact(contactWithRegionalCountry);
        expected.setResponsible(regionalResponsible);
        expected.setDescription("not in distribution updated v2");
        expected.setStatus(CompanySale.Status.OPPORTUNITY);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);

        expected.setStatusChangedDate(actual.getStatusChangedDate());
        expected.setCreateLeadDate(actual.getCreateLeadDate());
        assertEquals(expected, actual);
        verify(saleRequestService, Mockito.times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateSaleAndChangeResponsibleThenNotification() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(salesHead);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(company);
        updatedSale.setMainContact(contactWithRegionalCountry);
        updatedSale.setResponsible(regionalResponsible);
        updatedSale.setStatus(CompanySale.Status.OPPORTUNITY);
        companySaleServiceNew.updateSaleById(44L, updatedSale);
        verify(eventPublisher, Mockito.times(1)).publishEvent(any(CompanySaleAssignedEmailEmployeeNotifierEvent.class));
    }

    @Test(expected = CrmException.class)
    public void whenUpdateSaleAndResponsibleNotCurrentEmployeeThenThrowException() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(regionalResponsible);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(company);
        updatedSale.setMainContact(contactWithRegionalCountry);
        updatedSale.setResponsible(regionalResponsible);
        updatedSale.setDescription("not in distribution updated v3");
        updatedSale.setStatus(CompanySale.Status.OPPORTUNITY);

        companySaleServiceNew.updateSaleById(42L, updatedSale);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateNonExistingSaleThenThrowException() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(company);
        updatedSale.setMainContact(contactWithRegionalCountry);
        updatedSale.setResponsible(regionalResponsible);
        updatedSale.setDescription("not in distribution updated v4");
        updatedSale.setStatus(CompanySale.Status.OPPORTUNITY);

        companySaleServiceNew.updateSaleById(24L, updatedSale);
    }

    @Test
    public void whenUpdateSaleAndChangeCompanyThenMainContactNull() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(secondCompany);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(secondCompany);
        expected.setMainContact(null);
        expected.setResponsible(currentEmployee);
        expected.setDescription(NOT_IN_DISTRIBUTION_DESCRIPTION);
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);
        assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateSaleAndRecommendationIdMinusOneThenRecommendationNull() {
        CompanySale updatedSale = new CompanySale();
        Company flag = new Company();
        flag.setId(-1L);
        updatedSale.setRecommendedBy(flag);

        notInDistribution.setRecommendedBy(recommendationCompany);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(company);
        expected.setMainContact(contactWithoutRegionalCountry);
        expected.setResponsible(currentEmployee);
        expected.setDescription(NOT_IN_DISTRIBUTION_DESCRIPTION);
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);
        expected.setRecommendedBy(null);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);
        assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateSaleAndChangeBothCompanyAndMainContactThenSuccess() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(secondCompany);
        updatedSale.setMainContact(contactForSecondCompany);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(secondCompany);
        expected.setMainContact(contactForSecondCompany);
        expected.setResponsible(currentEmployee);
        expected.setDescription(NOT_IN_DISTRIBUTION_DESCRIPTION);
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);
        assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateSaleAndMainContactNotInCompanyThenMainContactNull() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(secondCompany);
        updatedSale.setMainContact(contactWithoutRegionalCountry);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(secondCompany);
        expected.setMainContact(null);
        expected.setResponsible(currentEmployee);
        expected.setDescription(NOT_IN_DISTRIBUTION_DESCRIPTION);
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);
        assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateSaleAndStatusForGoogleAdConversionThenUpdateConversion() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setStatus(CompanySale.Status.OPPORTUNITY);

        companySaleServiceNew.updateSaleById(42L, updatedSale);
        Mockito.verify(googleAdRecordService, times(1)).updateRecordOnSaleStatusChanged(eq(notInDistribution));
    }

    @Test
    public void whenUpdateSaleAndStatusNotForGoogleAdConversionThenDontUpdateConversion() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setStatus(CompanySale.Status.PRELEAD);

        companySaleServiceNew.updateSaleById(42L, updatedSale);
        Mockito.verify(googleAdRecordService, times(0)).updateRecordOnSaleStatusChanged(eq(notInDistribution));
    }

    @Test
    public void whenUpdateSaleAndNewResponsibleBotThenSaleToAutoDistributionAndNoRequestUpdate() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(company);
        updatedSale.setMainContact(contactWithoutRegionalCountry);
        updatedSale.setResponsible(crmBot);
        updatedSale.setDescription("in distribution updated v5");
        updatedSale.setStatus(CompanySale.Status.LEAD);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(company);
        expected.setMainContact(contactWithoutRegionalCountry);
        expected.setResponsible(crmBot);
        expected.setTimeStatus(CompanySaleTemp.Status.DAY);
        expected.setInDayAutoDistribution(true);
        expected.setDescription("in distribution updated v5");
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);

        expected.setStatusChangedDate(actual.getStatusChangedDate());
        expected.setCreateLeadDate(actual.getCreateLeadDate());
        assertEquals(expected, actual);
        verify(saleRequestService, Mockito.times(0)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateSaleAndNewResponsibleBotThenSaleToRegionalDistributionAndNoRequestUpdate() {
        CompanySale updatedSale = new CompanySale();
        updatedSale.setCompany(company);
        updatedSale.setMainContact(contactWithRegionalCountry);
        updatedSale.setResponsible(crmBot);
        updatedSale.setDescription("in regional distribution updated v6");
        updatedSale.setStatus(CompanySale.Status.LEAD);

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(company);
        expected.setMainContact(contactWithRegionalCountry);
        expected.setResponsible(regionalResponsible);
        expected.setTimeStatus(CompanySaleTemp.Status.REGIONAL);
        expected.setInDayAutoDistribution(false);
        expected.setDescription("in regional distribution updated v6");
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);

        expected.setStatusChangedDate(actual.getStatusChangedDate());
        expected.setCreateLeadDate(actual.getCreateLeadDate());
        assertEquals(expected, actual);
        verify(saleRequestService, Mockito.times(0)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateSaleAndResponsibleChangedFromBotThenRemoveFromDistributionAndUpdateRequests() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(salesHead);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setResponsible(currentEmployee);
        updatedSale.setDescription("in distribution updated v7");

        CompanySale expected = new CompanySale();
        expected.setId(43L);
        expected.setCompany(company);
        expected.setMainContact(contactWithoutRegionalCountry);
        expected.setResponsible(currentEmployee);
        expected.setTimeStatus(CompanySaleTemp.Status.DAY);
        expected.setInDayAutoDistribution(false);
        expected.setDescription("in distribution updated v7");
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(43L, updatedSale);
        assertEquals(expected, actual);
        verify(saleRequestService, Mockito.times(1)).assignResponsibleForAllRequestsByCompanySale(any(CompanySale.class), any(Employee.class));
    }

    @Test
    public void whenUpdateSaleAndNewStatusArchiveThenRemoveFromDistribution() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(salesHead);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setStatus(CompanySale.Status.ARCHIVE);
        updatedSale.setDescription("in distribution updated v8");

        CompanySale expected = new CompanySale();
        expected.setId(43L);
        expected.setCompany(company);
        expected.setMainContact(contactWithoutRegionalCountry);
        expected.setResponsible(crmBot);
        expected.setTimeStatus(CompanySaleTemp.Status.DAY);
        expected.setInDayAutoDistribution(false);
        expected.setDescription("in distribution updated v8");
        expected.setStatus(CompanySale.Status.ARCHIVE);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(43L, updatedSale);

        expected.setStatusChangedDate(actual.getStatusChangedDate());
        expected.setCreateLeadDate(actual.getCreateLeadDate());
        assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateSaleAndFromArchiveThenSaleToAutoDistribution() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(salesHead);

        notInDistribution.setResponsible(crmBot);
        notInDistribution.setStatus(CompanySale.Status.ARCHIVE);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setStatus(CompanySale.Status.LEAD);
        updatedSale.setDescription("in distribution updated v9");

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(company);
        expected.setMainContact(contactWithoutRegionalCountry);
        expected.setResponsible(crmBot);
        expected.setTimeStatus(CompanySaleTemp.Status.DAY);
        expected.setInDayAutoDistribution(true);
        expected.setDescription("in distribution updated v9");
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);

        expected.setStatusChangedDate(actual.getStatusChangedDate());
        expected.setCreateLeadDate(actual.getCreateLeadDate());
        assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateSaleAndFromArchiveThenSaleToRegionalDistribution() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(salesHead);

        notInDistribution.setResponsible(crmBot);
        notInDistribution.setStatus(CompanySale.Status.ARCHIVE);
        notInDistribution.setMainContact(contactWithRegionalCountry);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setStatus(CompanySale.Status.LEAD);
        updatedSale.setDescription("in distribution updated v10");

        CompanySale expected = new CompanySale();
        expected.setId(42L);
        expected.setCompany(company);
        expected.setMainContact(contactWithRegionalCountry);
        expected.setResponsible(regionalResponsible);
        expected.setTimeStatus(CompanySaleTemp.Status.REGIONAL);
        expected.setInDayAutoDistribution(false);
        expected.setDescription("in distribution updated v10");
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(42L, updatedSale);

        expected.setStatusChangedDate(actual.getStatusChangedDate());
        expected.setCreateLeadDate(actual.getCreateLeadDate());
        assertEquals(expected, actual);
    }

    @Test
    public void whenUpdateSaleAndNewMainContactThenSaleToRegionalDistribution() {
        when(authenticatedUser.getCurrentEmployee()).thenReturn(salesHead);

        CompanySale updatedSale = new CompanySale();
        updatedSale.setMainContact(contactWithRegionalCountry);
        updatedSale.setDescription("in distribution updated v11");

        CompanySale expected = new CompanySale();
        expected.setId(43L);
        expected.setCompany(company);
        expected.setMainContact(contactWithRegionalCountry);
        expected.setResponsible(regionalResponsible);
        expected.setTimeStatus(CompanySaleTemp.Status.REGIONAL);
        expected.setInDayAutoDistribution(false);
        expected.setDescription("in distribution updated v11");
        expected.setStatus(CompanySale.Status.LEAD);
        expected.setSource(sourceMail);

        CompanySale actual = companySaleServiceNew.updateSaleById(43L, updatedSale);
        assertEquals(expected, actual);
    }
}
