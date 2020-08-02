package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Activity;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.repositories.CompanySaleRepository;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import com.andersenlab.crm.rest.request.ContactUpdateRequest;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.Exporter;
import com.andersenlab.crm.services.SocialNetworkUserService;
import com.andersenlab.crm.services.distribution.CompanySaleDayDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleRegionalDistributionService;
import org.junit.Before;
import org.junit.Test;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class ContactServiceImplTest {
    private static final Long COMPANY_ID = 1L;
    private static final Long COUNTRY_ID = 1L;
    private ContactRepository contactRepository;
    private ConversionService conversionService;
    private ContactServiceImpl contactService;
    private CompanyService companyService;
    private ModelMapper modelMapper;

    @Before
    public void setup() {
        companyService = mock(CompanyService.class);
        conversionService = mock(ConversionService.class);
        contactRepository = mock(ContactRepository.class);
        Exporter exporter = mock(Exporter.class);
        CompanySaleRepository companySaleRepository = mock(CompanySaleRepository.class);
        SocialNetworkUserService socialNetworkUserService = mock(SocialNetworkUserService.class);
        CountryService countryService = mock(CountryService.class);
        CompanySaleTempService companySaleTempService = mock(CompanySaleTempService.class);
        CompanySaleRegionalDistributionService regionalDistributionService = mock(CompanySaleRegionalDistributionService.class);
        CompanySaleDayDistributionService dayDistributionService = mock(CompanySaleDayDistributionService.class);
        modelMapper = mock(ModelMapper.class);
        contactService = new ContactServiceImpl(
                contactRepository,
                companyService,
                conversionService,
                companySaleRepository,
                countryService,
                socialNetworkUserService,
                companySaleTempService,
                dayDistributionService,
                regionalDistributionService,
                exporter,
                modelMapper
        );
    }

    @Test
    public void whenCreateContactThenRepositorySaveAndFlush() {
        ContactCreateRequest request = new ContactCreateRequest();
        request.setCompanyId(COMPANY_ID);
        request.setCountryId(COUNTRY_ID);
        Contact contact = new Contact();
        Company company = new Company();

        given(conversionService.convert(request, Contact.class)).willReturn(contact);
        given(companyService.findCompanyByIdOrThrowException(COMPANY_ID)).willReturn(company);

        contactService.createContact(request);

        verify(contactRepository, times(1)).saveAndFlush(contact);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenCreateContactAndCompanyWithGivenNameNotFoundThenNotFoundException() {
        ContactCreateRequest request = new ContactCreateRequest();
        request.setCompanyId(COMPANY_ID);
        request.setCountryId(COUNTRY_ID);
        Contact contact = new Contact();

        given(conversionService.convert(request, Contact.class)).willReturn(contact);
        given(companyService.findCompanyByIdOrThrowException(COMPANY_ID))
                .willThrow(new ResourceNotFoundException("not found"));

        contactService.createContact(request);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenUpdateCompanyAndCompanyNotFoundThenExpectedNotFoundException() {
        given(contactRepository.findOne(1L)).willReturn(null);
        contactService.updateContact(1L, new ContactUpdateRequest());
    }

    @Test
    public void whenGetContactByIdThenReturnExpectedResponse() {
        Contact contact = new Contact();
        contact.setId(1L);
        contact.setIsActive(true);

        given(contactRepository.findOne(1L)).willReturn(contact);
        Contact companyById = contactService.getContactById(1L);

        assertSame(contact, companyById);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenGetCompanyByNameAndCompanyNotFoundThenExpectedNotFoundException() {
        given(contactRepository.findOne(1L)).willReturn(null);
        contactService.getContactById(1L);
    }

    @Test
    public void whenArchiveCompanyThenIsActiveFalseArchiveServiceInvokes() {
        Contact contactToArchive = new Contact();
        contactToArchive.setIsActive(true);
        ContactUpdateRequest updateRequest = new ContactUpdateRequest();
        updateRequest.setIsActive(false);

        given(contactRepository.findOne(1L)).willReturn(contactToArchive);
        contactService.updateContact(1L, updateRequest);
        when(modelMapper.map(any(), any())).thenReturn(contactToArchive);
        contactToArchive.setIsActive(false);

        assertFalse(contactToArchive.getIsActive());
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenArchiveCompanyAndNoSuchCompanyThenResourceNotFound() {
        given(contactRepository.findOne(1L)).willReturn(null);
        ContactUpdateRequest updateRequest = new ContactUpdateRequest();
        updateRequest.setIsActive(false);
        contactService.updateContact(1L, updateRequest);
    }

    @Test
    public void deleteContactWhichHasSalesAndActivities() {
        Contact contact = new Contact(1L);
        contact.setIsActive(true);
        List<CompanySale> sales = new ArrayList<>();
        sales.add(new CompanySale());
        contact.setSales(sales);
        contact.getSales().forEach(sale -> sale.setMainContact(contact));
        Set<Activity> activities = new HashSet<>();
        activities.add(new Activity());
        contact.setActivities(activities);
        given(contactRepository.findOne(anyLong())).willReturn(contact);

        contactService.deleteContact(contact.getId());

        contact.getSales().forEach(sale -> assertEquals(null, sale.getMainContact()));
        assertEquals(false, contact.getIsActive());
    }

    @Test
    public void deleteContactWhichHasSalesAndNotHasActivities() {
        Contact contact = new Contact(1L);
        List<CompanySale> sales = new ArrayList<>();
        sales.add(new CompanySale());
        contact.setSales(sales);
        contact.getSales().forEach(sale -> sale.setMainContact(contact));
        given(contactRepository.findOne(anyLong())).willReturn(contact);

        contactService.deleteContact(contact.getId());

        contact.getSales().forEach(sale -> assertEquals(null, sale.getMainContact()));
        verify(contactRepository).delete(contact);
    }
}
