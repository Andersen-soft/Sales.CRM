package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.response.ContactResponse;
import com.andersenlab.crm.services.ContactService;
import com.querydsl.core.types.Predicate;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@AllArgsConstructor
public class ContactFacadeImpl implements ContactFacade {

    private final ContactService contactService;
    private final ConversionService conversionService;

    @Override
    public Page<ContactResponse> getContactsWithFilter(Predicate predicate, Pageable pageable) {
        Page<Contact> pageContact = contactService.getContactsWithFilter(predicate, pageable);
        return conversionService.convertToPage(pageable, pageContact, ContactResponse.class);
    }

    @Override
    public Page<ContactResponse> getContactsWithFilterAndLocale(Predicate predicate, Pageable pageable, Locale locale) {
        Page<Contact> pageContact = contactService.getContactsWithFilter(predicate, pageable);
        return conversionService.convertToPageWithLocale(pageable, pageContact, ContactResponse.class, locale);
    }
}
