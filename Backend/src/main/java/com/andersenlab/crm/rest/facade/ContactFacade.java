package com.andersenlab.crm.rest.facade;

import com.andersenlab.crm.rest.response.ContactResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Locale;

public interface ContactFacade {
    Page<ContactResponse> getContactsWithFilter(Predicate predicate, Pageable pageable);
    Page<ContactResponse> getContactsWithFilterAndLocale(Predicate predicate, Pageable pageable, Locale locale);
}
