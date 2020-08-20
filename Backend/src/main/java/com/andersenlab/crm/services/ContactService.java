package com.andersenlab.crm.services;

import com.andersenlab.crm.dbtools.dto.ContactReport;
import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.rest.request.ContactCreateRequest;
import com.andersenlab.crm.rest.request.ContactUpdateRequest;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

/**
 * Encapsulates business logic and persistence related to contacts.
 *
 * @see Contact
 */
public interface ContactService {

    /**
     * Updates the contact with the given id
     *
     * @param id      the identification of contact to update
     * @param contact the updated contact
     */
    void updateContact(Long id, ContactUpdateRequest contact);

    /**
     * Retrieves a contact by its id.
     *
     * @param id the identification of contact to retrieve
     * @return the contact with the given id
     */

    Contact getContactById(Long id);

    /**
     * Saves a given contact
     *
     * @param request the request which contains contact to save
     */
    Long createContact(ContactCreateRequest request);

    Contact createContact(Contact contact);

    /**
     * Retrieves all contacts with search criteria
     */
    Page<Contact> getContactsWithFilter(Predicate predicate, Pageable pageable);

    void deleteContact(Long id);

    List<ContactReport> getContactsForReport(LocalDate createDateFrom, LocalDate createDateTo);
}
