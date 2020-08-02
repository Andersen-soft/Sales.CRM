package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Contact;
import com.andersenlab.crm.model.entities.ContactsArchive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactsArchiveRepository extends JpaRepository<ContactsArchive, Long> {
    void deleteByContact(Contact contact);
}
