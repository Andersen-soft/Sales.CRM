package com.andersenlab.crm.services.impl;

import com.amazonaws.services.glue.model.EntityNotFoundException;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.dbtools.dto.ContactReport;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.QContact;
import com.andersenlab.crm.repositories.CompanySaleRepository;
import com.andersenlab.crm.repositories.ContactRepository;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import com.andersenlab.crm.rest.request.ContactUpdateRequest;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.CompanyService;
import com.andersenlab.crm.services.ContactService;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.Exporter;
import com.andersenlab.crm.services.SocialNetworkUserService;
import com.andersenlab.crm.services.distribution.CompanySaleDayDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleRegionalDistributionService;
import com.querydsl.core.types.Predicate;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static java.util.Optional.ofNullable;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {
    private final ContactRepository contactRepository;
    private final CompanyService companyService;
    private final ConversionService conversionService;
    private final CompanySaleRepository companySaleRepository;
    private final CountryService countryService;
    private final SocialNetworkUserService socialNetworkUserService;
    private final CompanySaleTempService companySaleTempService;
    private final CompanySaleDayDistributionService dayDistributionService;
    private final CompanySaleRegionalDistributionService regionalDistributionService;
    private final Exporter exporter;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public Long createContact(ContactCreateRequest request) {
        if (request.getCountryId() == null) {
            throw new javax.persistence.EntityNotFoundException("Country not found: " + request.getCountryId());
        }
        ofNullable(request.getCountryId()).ifPresent(countryService::validateById);
        Contact contact = conversionService.convert(request, Contact.class);
        contact.setIsActive(true);
        contact.setCompany(companyService.findCompanyByIdOrThrowException(request.getCompanyId()));
        contactRepository.saveAndFlush(contact);
        if (request.getMainContact() != null && request.getMainContact() && request.getSaleId() != null) {
            CompanySale companySale = companySaleRepository.findOne(request.getSaleId());
            companySale.setMainContact(contact);
            companySaleRepository.saveAndFlush(companySale);
        }
        return contact.getId();
    }

    @Override
    public Contact createContact(Contact contact) {
        contact.setIsActive(true);
        return contactRepository.saveAndFlush(contact);
    }

    @Override
    public Contact getContactById(Long id) {
        return ofNullable(findContactById(id))
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    @Override
    public Page<Contact> getContactsWithFilter(Predicate predicate, Pageable pageable) {
        Predicate p = QContact.contact.isActive.eq(true)
                .and(predicate);
        return contactRepository.findAll(p, pageable);
    }

    @Override
    public List<ContactReport> getContactsForReport(LocalDate createDateFrom, LocalDate createDateTo) {
        return exporter.getContactsForReport(createDateFrom, createDateTo);
    }

    @Transactional
    @Override
    public void updateContact(Long contactId, ContactUpdateRequest request) {
        Contact contact = getContactById(contactId);
        modelMapper.map(request, contact);

        ofNullable(request.getSocialNetworkUserId())
                .ifPresent(id -> updateSocialNetworkUser(contact, id));
        ofNullable(request.getCountryId())
                .ifPresent(id -> updateCountry(contact, id));

        contactRepository.saveAndFlush(contact);
    }

    @Override
    @Transactional
    public void deleteContact(Long id) {
        Contact contact = contactRepository.findOne(id);
        if (!contact.getSales().isEmpty()) {
            contact.getSales().forEach(sale -> sale.setMainContact(null));
        }
        if (!contact.getActivities().isEmpty()) {
            contact.setIsActive(false);
            contactRepository.saveAndFlush(contact);
        } else {
            contactRepository.delete(contact);
        }
    }

    private Contact findContactById(Long id) {
        Contact contact = contactRepository.findOne(id);
        return contact == null || !contact.getIsActive() ? null : contact;
    }

    private void updateCountry(Contact contact, Long countryId) {
        if (countryId == -1) {
            contact.setCountry(null);
        } else if (countryService.exist(countryId)) {
            contact.setCountry(countryService.findById(countryId));
            checkForRegionalDistribution(contact);
        } else {
            throw new EntityNotFoundException("Country not found: " + countryId);
        }
    }

    private void updateSocialNetworkUser(Contact contact, Long socialNetworkUserId) {
        if (socialNetworkUserId == -1) {
            contact.setSocialNetworkUser(null);
        } else {
            contact.setSocialNetworkUser(socialNetworkUserService.findByIdOrThrowException(socialNetworkUserId));

        }
    }

    private void checkForRegionalDistribution(Contact contact) {
        Employee regionalEmployee = regionalDistributionService.findNextRegionalEmployeeByCountry(contact.getCountry());
        Optional.ofNullable(regionalEmployee).ifPresent(e -> {
            List<CompanySale> distributionSales = contact.getSales();
            distributionSales.stream()
                    .filter(CompanySale::isInDayAutoDistribution)
                    .forEach(sale -> {
                        regionalDistributionService.setResponsibleRegionalEmployeeAndMailNotify(sale, e);
                        dayDistributionService.updateQueueOnSaleRemovedFromDistribution(sale);
                        dayDistributionService.notifyAboutCompanySaleRemovedFromDistribution(sale);
                        sale.setInDayAutoDistribution(false);
                        companySaleTempService.deleteByCorrespondingCompanySale(sale);
                    });
        });
    }
}
