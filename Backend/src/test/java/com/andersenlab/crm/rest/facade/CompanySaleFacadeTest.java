package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.EventType;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.Sex;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleGoogleAdRecord;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.model.entities.Source;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.SourceRepository;
import com.andersenlab.crm.rest.dto.MailImportSaleRequest;
import com.andersenlab.crm.rest.dto.MailImportSaleResponse;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import com.andersenlab.crm.rest.request.CompanySaleCreateRequest;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import com.andersenlab.crm.rest.request.ExpressSaleCreateRequest;
import com.andersenlab.crm.rest.request.SiteCreateDto;
import com.andersenlab.crm.rest.response.ExpressSaleDto;
import com.andersenlab.crm.rest.response.ExpressSaleResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.ActivityService;
import com.andersenlab.crm.services.CompanySaleGoogleAdRecordService;
import com.andersenlab.crm.services.CompanySaleServiceNew;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.ContactService;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailImportSaleHistoryService;
import org.apache.commons.validator.routines.EmailValidator;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;
import org.springframework.context.ApplicationEventPublisher;

import java.util.ArrayList;
import java.util.Collections;

import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.EMPLOYEE_NOT_FOUND;
import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.EMPLOYEE_NOT_SALES;
import static com.andersenlab.crm.model.entities.MailImportSaleHistory.MailImportSaleResult.SUCCESS_SALE;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;

public class CompanySaleFacadeTest {
    private static final String CONTACT_NAME_ADAMS = "adams";
    private static final String CONTACT_EMAIL = "hitchhiker@yeet.com";
    private static final String CONTACT_PHONE = "375-42";
    private static final String CONTACT_IP = "42";
    private static final String SALE_DESCRIPTION = "the answer to life, the universe, and everything";
    private static final String VALID_FORM = "defaultTemplate";
    private static final String ACTIVE_EMPLOYEE_EMAIL = "employee@yeet.com";
    private static final String INACTIVE_EMPLOYEE_EMAIL = "inact_employee@yeet.com";

    private static final String MOCKED_COMPANY_NAME = "example";

    private final CompanySaleServiceNew companySaleServiceNew = mock(CompanySaleServiceNew.class);
    private final CompanySaleGoogleAdRecordService googleAdRecordService = mock(CompanySaleGoogleAdRecordService.class);
    private final ActivityService activityService = mock(ActivityService.class);
    private final CompanyService companyService = mock(CompanyService.class);
    private final ContactService contactService = mock(ContactService.class);
    private final ContactRepository contactRepository = mock(ContactRepository.class);
    private final CountryService countryService = mock(CountryService.class);
    private final EmployeeService employeeService = mock(EmployeeService.class);
    private final MailImportSaleHistoryService mailImportSaleHistoryService = mock(MailImportSaleHistoryService.class);
    private final SourceRepository sourceRepository = mock(SourceRepository.class);
    private final ConversionService conversionService = mock(ConversionService.class);
    private final EmployeeRepository employeeRepository = mock(EmployeeRepository.class);
    private final AuthenticatedUser authenticatedUser = mock(AuthenticatedUser.class);
    private final ApplicationEventPublisher eventPublisher = mock(ApplicationEventPublisher.class);
    private final EmailValidator emailValidator = mock(EmailValidator.class);

    private final CompanySaleFacade companySaleFacade = new CompanySaleFacadeImpl(
            companySaleServiceNew,
            googleAdRecordService,
            activityService,
            companyService,
            contactService,
            contactRepository,
            countryService,
            employeeService,
            mailImportSaleHistoryService,
            sourceRepository,
            conversionService,
            employeeRepository,
            authenticatedUser,
            eventPublisher,
            emailValidator
    );

    @Before
    public void setUpEntities() {
        Mockito.when(companySaleServiceNew.createSale(any(CompanySale.class)))
                .thenAnswer(a -> a.getArguments()[0]);
        Mockito.when(companyService.createCompany(any(Company.class)))
                .thenAnswer(a -> a.getArguments()[0]);
        Mockito.when(contactService.createContact(any(Contact.class)))
                .thenAnswer(a -> {
                    Contact contact = (Contact) a.getArguments()[0];
                    if (contact.getCompany().getContacts() != null) {
                        contact.getCompany().getContacts().add(contact);
                    }
                    return contact;
                });

        Source mailSource = new Source();
        mailSource.setId(1L);
        mailSource.setName("E-mail");
        Mockito.when(sourceRepository.getOne(1L)).thenReturn(mailSource);
        Mockito.when(sourceRepository.findSourceByNameEqualsIgnoreCase("E-mail"))
                .thenReturn(mailSource);

        Source siteSource = new Source();
        siteSource.setId(2L);
        siteSource.setName("Site");
        Mockito.when(sourceRepository.getOne(2L)).thenReturn(siteSource);
        Mockito.when(sourceRepository.findSourceByNameEqualsIgnoreCase("Site"))
                .thenReturn(siteSource);

        Company mockedCompany = new Company();
        mockedCompany.setId(1L);
        mockedCompany.setName(MOCKED_COMPANY_NAME);
        mockedCompany.setIsActive(true);

        Contact mockedContact = new Contact();
        mockedContact.setId(1L);
        mockedContact.setFirstName("test");
        mockedContact.setLastName("contact");
        mockedContact.setSex(Sex.MALE);
        mockedContact.setCompany(mockedCompany);
        mockedContact.setIsActive(true);
        Mockito.when(contactService.getContactById(1L))
                .thenReturn(mockedContact);

        mockedCompany.setContacts(Collections.singletonList(mockedContact));
        Mockito.when(companyService.findCompanyByIdOrThrowException(1L))
                .thenReturn(mockedCompany);
        Mockito.when(companyService.findCompanyByName(MOCKED_COMPANY_NAME))
                .thenReturn(mockedCompany);

        Mockito.when(contactRepository.findAllByCompanyId(any(Long.class)))
                .thenReturn(Collections.emptyList());
        Mockito.when(contactRepository.findAllByCompanyId(1L))
                .thenReturn(Collections.singletonList(mockedContact));

        String forMocked = "employee";
        Employee mockedEmployee = new Employee();
        mockedEmployee.setId(1L);
        mockedEmployee.setLogin(forMocked);
        mockedEmployee.setEmail(ACTIVE_EMPLOYEE_EMAIL);
        mockedEmployee.setIsActive(true);

        Role roleSales = new Role();
        roleSales.setId(1L);
        roleSales.setName(RoleEnum.ROLE_SALES);
        mockedEmployee.setRoles(Collections.singleton(roleSales));

        Mockito.when(employeeRepository.findById(1L))
                .thenReturn(mockedEmployee);
        Mockito.when(employeeRepository.findEmployeeByLogin(forMocked))
                .thenReturn(mockedEmployee);
        Mockito.when(employeeService.findByEmail(ACTIVE_EMPLOYEE_EMAIL))
                .thenReturn(mockedEmployee);

        String forBot = "site";
        Employee crmBot = new Employee();
        crmBot.setId(2L);
        crmBot.setLogin(forBot);
        crmBot.setEmail(forBot);

        Role roleSite = new Role();
        roleSite.setId(2L);
        roleSite.setName(RoleEnum.ROLE_SITE);
        crmBot.setRoles(Collections.singleton(roleSite));

        Mockito.when(employeeRepository.findEmployeeByLogin(forBot))
                .thenReturn(crmBot);
    }

    @Test
    public void whenCreateSaleWithCompanyIdThenSuccess() {
        CompanySaleCreateRequest saleRequest = new CompanySaleCreateRequest();
        CompanyCreateRequest companyRequest = new CompanyCreateRequest();
        companyRequest.setName(MOCKED_COMPANY_NAME);
        companyRequest.setContactId(1L);
        saleRequest.setCompany(companyRequest);
        saleRequest.setSourceId(1L);

        Long expectedId = null;
        Long actualId = companySaleFacade.createCompanySale(saleRequest);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(0)).createContact(any(ContactCreateRequest.class));
    }

    @Test
    public void whenCreateSaleAndCompanyNotFoundThenCreateNewCompanyAndSuccess() {
        CompanySaleCreateRequest saleRequest = new CompanySaleCreateRequest();
        CompanyCreateRequest companyRequest = new CompanyCreateRequest();
        companyRequest.setName("new company");
        companyRequest.setContactId(null);
        saleRequest.setSourceId(1L);

        ContactCreateRequest contactRequest = new ContactCreateRequest();
        contactRequest.setFirstName("new contact");
        contactRequest.setSourceId(1L);

        companyRequest.setContact(contactRequest);
        saleRequest.setCompany(companyRequest);

        Company mockedCompany = new Company();
        mockedCompany.setId(2L);
        mockedCompany.setName("new company");
        mockedCompany.setContacts(new ArrayList<>());
        Mockito.when(companyService.createCompany(companyRequest))
                .thenReturn(mockedCompany);

        Long expectedId = null;
        Long actualId = companySaleFacade.createCompanySale(saleRequest);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(CompanyCreateRequest.class));
        Mockito.verify(contactService, times(1)).createContact(any(ContactCreateRequest.class));
    }

    @Test
    public void whenCreateSaleAndContactNotFoundThenCreateNewContactAndSuccess() {
        CompanySaleCreateRequest saleRequest = new CompanySaleCreateRequest();
        CompanyCreateRequest companyRequest = new CompanyCreateRequest();
        companyRequest.setName(MOCKED_COMPANY_NAME);
        saleRequest.setSourceId(1L);

        ContactCreateRequest contactRequest = new ContactCreateRequest();
        contactRequest.setFirstName("new contact");
        contactRequest.setSourceId(1L);

        companyRequest.setContact(contactRequest);
        saleRequest.setCompany(companyRequest);

        Long expectedId = null;
        Long actualId = companySaleFacade.createCompanySale(saleRequest);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(ContactCreateRequest.class));
    }

    @Test(expected = CrmException.class)
    public void whenImportSaleWithoutEmailNorPhoneThenThrowException() {
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(null);
        request.setPhone(null);
        request.setContent(SALE_DESCRIPTION);
        request.setForm(VALID_FORM);

        companySaleFacade.importCompanySaleFromSite(request);
    }

    @Test
    public void whenImportSaleWithEmailOnlyThenSuccess() {
        Mockito.when(emailValidator.isValid(any(String.class))).thenReturn(true);
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setContent(SALE_DESCRIPTION);
        request.setForm(VALID_FORM);

        Long expectedId = null;
        Long actualId = companySaleFacade.importCompanySaleFromSite(request);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenImportSaleAndGoogleClickIdSpecifiedThenSuccessAndCreateRecord() {
        Mockito.when(emailValidator.isValid(any(String.class))).thenReturn(true);
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setContent(SALE_DESCRIPTION);
        request.setForm(VALID_FORM);
        request.setGoogleClickId("example-id");

        Long expectedId = null;
        Long actualId = companySaleFacade.importCompanySaleFromSite(request);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
        Mockito.verify(googleAdRecordService, times(1)).create(any(CompanySaleGoogleAdRecord.class));
    }

    @Test
    public void whenImportSaleWithPhoneOnlyThenSuccess() {
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(null);
        request.setPhone(CONTACT_PHONE);
        request.setContent(SALE_DESCRIPTION);
        request.setForm(VALID_FORM);

        Long expectedId = null;
        Long actualId = companySaleFacade.importCompanySaleFromSite(request);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test(expected = CrmException.class)
    public void whenImportSaleAndFormInvalidThenThrowException() {
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setContent(SALE_DESCRIPTION);
        request.setForm("");

        companySaleFacade.importCompanySaleFromSite(request);
    }

    @Test
    public void whenImportSaleAndWithPreviousCompanyThenSuccess() {
        Mockito.when(emailValidator.isValid(any(String.class))).thenReturn(true);
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(CONTACT_EMAIL);
        request.setPhone(CONTACT_PHONE);
        request.setContent(SALE_DESCRIPTION);
        request.setForm(VALID_FORM);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setContacts(new ArrayList<>());
        existingCompany.setIsActive(true);
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);

        Long expectedId = null;
        Long actualId = companySaleFacade.importCompanySaleFromSite(request);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenImportSaleAndWithPreviousContactThenSuccess() {
        Mockito.when(emailValidator.isValid(any(String.class))).thenReturn(true);
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(CONTACT_EMAIL);
        request.setPhone(CONTACT_PHONE);
        request.setContent(SALE_DESCRIPTION);
        request.setForm(VALID_FORM);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setIsActive(true);

        Contact existingContact = new Contact();
        existingContact.setCompany(existingCompany);
        existingCompany.setName(CONTACT_NAME_ADAMS);
        existingContact.setEmail(CONTACT_EMAIL);
        existingContact.setSex(Sex.MALE);
        existingContact.setIsActive(true);
        existingCompany.setContacts(Collections.singletonList(existingContact));
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);
        Mockito.when(contactRepository.findAllByCompanyId(2L)).thenReturn(Collections.singletonList(existingContact));

        Long expectedId = null;
        Long actualId = companySaleFacade.importCompanySaleFromSite(request);

        // Note: this assert is always true due to api design.
        // If facade method returned companySale dto, this would be more accurate verification.
        Assert.assertEquals(expectedId, actualId);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(0)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenImportSaleAndWithPreviousSalesThenCreateActivities() {
        Mockito.when(emailValidator.isValid(any(String.class))).thenReturn(true);
        SiteCreateDto request = new SiteCreateDto();
        request.setName(CONTACT_NAME_ADAMS);
        request.setIp(CONTACT_IP);
        request.setEmail(CONTACT_EMAIL);
        request.setPhone(CONTACT_PHONE);
        request.setContent(SALE_DESCRIPTION);
        request.setForm(VALID_FORM);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setIsActive(true);

        Contact existingContact = new Contact();
        existingContact.setCompany(existingCompany);
        existingContact.setFirstName(CONTACT_NAME_ADAMS);
        existingContact.setEmail(CONTACT_EMAIL);
        existingContact.setSex(Sex.MALE);
        existingContact.setIsActive(true);
        existingCompany.setContacts(Collections.singletonList(existingContact));
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);
        Mockito.when(contactRepository.findAllByCompanyId(2L)).thenReturn(Collections.singletonList(existingContact));

        CompanySale existingSale = new CompanySale();
        existingSale.setId(2L);
        existingSale.setCompany(existingCompany);
        existingSale.setMainContact(existingContact);

        Mockito.when(companySaleServiceNew.findPreviousCompanySalesByContactEmailOrPhone(any(), eq(CONTACT_EMAIL), eq(CONTACT_PHONE)))
                .thenReturn(Collections.singletonList(existingSale));

        Long actualId = companySaleFacade.importCompanySaleFromSite(request);
        Assert.assertNull(actualId);

        Mockito.verify(companySaleServiceNew, times(0)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(0)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test(expected = CrmException.class)
    public void whenExpressSaleWithoutEmailNorPhoneThenThrowException() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(null);
        request.setPhone(null);
        request.setDescription(SALE_DESCRIPTION);

        companySaleFacade.createExpressSale(request);
    }

    @Test
    public void whenExpressSaleWithEmailOnlyThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setDescription(SALE_DESCRIPTION);

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSale(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleWithPhoneOnlyThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(null);
        request.setPhone(CONTACT_PHONE);
        request.setDescription(SALE_DESCRIPTION);

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_PHONE);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSale(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleAndWithPreviousCompanyThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setDescription(SALE_DESCRIPTION);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setIsActive(true);
        existingCompany.setContacts(new ArrayList<>());
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSale(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleAndWithPreviousContactThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setDescription(SALE_DESCRIPTION);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setIsActive(true);

        Contact existingContact = new Contact();
        existingContact.setCompany(existingCompany);
        existingContact.setFirstName(CONTACT_NAME_ADAMS);
        existingContact.setEmail(CONTACT_EMAIL);
        existingContact.setSex(Sex.MALE);
        existingContact.setIsActive(true);
        existingCompany.setContacts(Collections.singletonList(existingContact));
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);
        Mockito.when(contactRepository.findAllByCompanyId(2L)).thenReturn(Collections.singletonList(existingContact));

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSale(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(0)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleAndWithPreviousSalesThenCreateActivities() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setDescription(SALE_DESCRIPTION);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setIsActive(true);

        Contact existingContact = new Contact();
        existingContact.setCompany(existingCompany);
        existingContact.setFirstName(CONTACT_NAME_ADAMS);
        existingContact.setEmail(CONTACT_EMAIL);
        existingContact.setSex(Sex.MALE);
        existingContact.setIsActive(true);
        existingCompany.setContacts(Collections.singletonList(existingContact));
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);
        Mockito.when(contactRepository.findAllByCompanyId(2L)).thenReturn(Collections.singletonList(existingContact));

        CompanySale existingSale = new CompanySale();
        existingSale.setId(2L);
        existingSale.setCompany(existingCompany);
        existingSale.setMainContact(existingContact);

        Mockito.when(companySaleServiceNew.findPreviousCompanySalesByContactEmailOrPhone(any(), eq(CONTACT_EMAIL), any()))
                .thenReturn(Collections.singletonList(existingSale));

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(2L);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.UPDATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSale(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(0)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(0)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test(expected = CrmException.class)
    public void whenExpressSaleByMailWithoutEmailNorPhoneThenThrowException() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(null);
        request.setPhone(null);
        request.setResponsibleId(1L);
        request.setDescription(SALE_DESCRIPTION);

        companySaleFacade.createExpressSaleByMail(request);
    }

    @Test
    public void whenExpressSaleByMailWithEmailOnlyThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setResponsibleId(1L);
        request.setDescription(SALE_DESCRIPTION);

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSaleByMail(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleByMailWithPhoneOnlyThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(null);
        request.setPhone(CONTACT_PHONE);
        request.setResponsibleId(1L);
        request.setDescription(SALE_DESCRIPTION);

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_PHONE);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSaleByMail(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(1)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleByMailAndWithPreviousCompanyThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setResponsibleId(1L);
        request.setDescription(SALE_DESCRIPTION);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setContacts(new ArrayList<>());
        existingCompany.setIsActive(true);
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSaleByMail(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(1)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleByMailAndWithPreviousContactThenSuccess() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setResponsibleId(1L);
        request.setDescription(SALE_DESCRIPTION);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setIsActive(true);

        Contact existingContact = new Contact();
        existingContact.setCompany(existingCompany);
        existingContact.setFirstName(CONTACT_NAME_ADAMS);
        existingContact.setEmail(CONTACT_EMAIL);
        existingContact.setSex(Sex.MALE);
        existingContact.setIsActive(true);
        existingCompany.setContacts(Collections.singletonList(existingContact));
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);
        Mockito.when(contactRepository.findAllByCompanyId(2L)).thenReturn(Collections.singletonList(existingContact));

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(null);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.CREATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSaleByMail(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(0)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenExpressSaleByMailAndWithPreviousSalesThenCreateActivities() {
        ExpressSaleCreateRequest request = new ExpressSaleCreateRequest();
        request.setName(CONTACT_NAME_ADAMS);
        request.setCountryId(1L);
        request.setMail(CONTACT_EMAIL);
        request.setPhone(null);
        request.setResponsibleId(1L);
        request.setDescription(SALE_DESCRIPTION);

        Company existingCompany = new Company();
        existingCompany.setId(2L);
        existingCompany.setName(CONTACT_EMAIL);
        existingCompany.setIsActive(true);

        Contact existingContact = new Contact();
        existingContact.setCompany(existingCompany);
        existingContact.setFirstName(CONTACT_NAME_ADAMS);
        existingContact.setEmail(CONTACT_EMAIL);
        existingContact.setSex(Sex.MALE);
        existingCompany.setIsActive(true);
        existingCompany.setContacts(Collections.singletonList(existingContact));
        Mockito.when(companyService.findCompanyByName(CONTACT_EMAIL)).thenReturn(existingCompany);
        Mockito.when(contactRepository.findAllByCompanyId(2L)).thenReturn(Collections.singletonList(existingContact));

        CompanySale existingSale = new CompanySale();
        existingSale.setId(2L);
        existingSale.setCompany(existingCompany);
        existingSale.setMainContact(existingContact);

        Mockito.when(companySaleServiceNew.findPreviousCompanySalesByContactEmailOrPhone(any(), eq(CONTACT_EMAIL), any()))
                .thenReturn(Collections.singletonList(existingSale));

        ExpressSaleResponse expectedResponse = new ExpressSaleResponse();
        ExpressSaleDto expectedDto = new ExpressSaleDto();
        expectedDto.setId(2L);
        expectedDto.setCompanyName(CONTACT_EMAIL);
        expectedResponse.setSales(Collections.singletonList(expectedDto));
        expectedResponse.setType(EventType.UPDATE);

        ExpressSaleResponse actualResponse = companySaleFacade.createExpressSaleByMail(request);
        Assert.assertEquals(expectedResponse, actualResponse);

        Mockito.verify(companySaleServiceNew, times(0)).createSale(any(CompanySale.class));
        Mockito.verify(companyService, times(0)).createCompany(any(Company.class));
        Mockito.verify(contactService, times(0)).createContact(any(Contact.class));
        Mockito.verify(activityService, times(1)).createActivity(any(Activity.class));
    }

    @Test
    public void whenImportSaleByMailThenCallServiceMethodAndSuccess() {
        MailImportSaleRequest request = new MailImportSaleRequest();
        request.setSender(CONTACT_EMAIL);
        request.setReceiver(ACTIVE_EMPLOYEE_EMAIL);
        request.setBody(SALE_DESCRIPTION);

        MailImportSaleResponse expected = MailImportSaleResponse.builder()
                .saleId(null)
                .build();

        MailImportSaleResponse actual = companySaleFacade.importCompanySaleFromMail(request);
        Assert.assertEquals(expected, actual);
        Mockito.verify(companySaleServiceNew, times(1)).createSale(any(CompanySale.class));
        Mockito.verify(mailImportSaleHistoryService, times(1)).createFromRequest(eq(request), any(CompanySale.class), eq(SUCCESS_SALE));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenImportSaleByMailAndNoEmployeeThenThrowException() {
        MailImportSaleRequest request = new MailImportSaleRequest();
        request.setSender(CONTACT_EMAIL);
        request.setReceiver("random string");
        request.setBody(SALE_DESCRIPTION);

        companySaleFacade.importCompanySaleFromMail(request);
        Mockito.verify(companySaleServiceNew, times(0)).createSale(any(CompanySale.class));
        Mockito.verify(mailImportSaleHistoryService, times(1)).createFromRequest(eq(request), any(CompanySale.class), eq(SUCCESS_SALE));
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenImportSaleByMailAndEmployeeInactiveThenThrowException() {
        MailImportSaleRequest request = new MailImportSaleRequest();
        request.setSender(CONTACT_EMAIL);
        request.setReceiver(INACTIVE_EMPLOYEE_EMAIL);
        request.setBody(SALE_DESCRIPTION);

        String inactive = "inactive";
        Employee inactiveEmployee = new Employee();
        inactiveEmployee.setId(2L);
        inactiveEmployee.setLogin(inactive);
        inactiveEmployee.setEmail(INACTIVE_EMPLOYEE_EMAIL);
        inactiveEmployee.setIsActive(false);

        Role roleSales = new Role();
        roleSales.setId(1L);
        roleSales.setName(RoleEnum.ROLE_SALES);
        inactiveEmployee.setRoles(Collections.singleton(roleSales));

        Mockito.when(employeeService.findByEmail(INACTIVE_EMPLOYEE_EMAIL))
                .thenReturn(inactiveEmployee);

        companySaleFacade.importCompanySaleFromMail(request);
        Mockito.verify(companySaleServiceNew, times(0)).createSale(any(CompanySale.class));
        Mockito.verify(mailImportSaleHistoryService, times(1)).createFromRequest(eq(request), eq(null), eq(EMPLOYEE_NOT_FOUND));
    }

    @Test(expected = CrmException.class)
    public void whenImportSaleByMailAndEmployeeNotSalesThenThrowException() {
        MailImportSaleRequest request = new MailImportSaleRequest();
        request.setSender(CONTACT_EMAIL);
        request.setReceiver(INACTIVE_EMPLOYEE_EMAIL);
        request.setBody(SALE_DESCRIPTION);

        String notSales = "not_sales";
        Employee activeButNotSales = new Employee();
        activeButNotSales.setId(3L);
        activeButNotSales.setLogin(notSales);
        activeButNotSales.setEmail(INACTIVE_EMPLOYEE_EMAIL);
        activeButNotSales.setIsActive(true);

        Role roleManager = new Role();
        roleManager.setId(1L);
        roleManager.setName(RoleEnum.ROLE_MANAGER);
        activeButNotSales.setRoles(Collections.singleton(roleManager));

        Mockito.when(employeeService.findByEmail(INACTIVE_EMPLOYEE_EMAIL))
                .thenReturn(activeButNotSales);

        companySaleFacade.importCompanySaleFromMail(request);
        Mockito.verify(companySaleServiceNew, times(0)).createSale(any(CompanySale.class));
        Mockito.verify(mailImportSaleHistoryService, times(1)).createFromRequest(eq(request), eq(null), eq(EMPLOYEE_NOT_SALES));
    }
}
