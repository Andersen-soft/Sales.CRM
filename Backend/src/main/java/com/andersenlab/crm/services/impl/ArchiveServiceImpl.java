package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.*;
import com.andersenlab.crm.repositories.CompanyArchiveRepository;
import com.andersenlab.crm.repositories.CompanySaleArchiveRepository;
import com.andersenlab.crm.repositories.ContactsArchiveRepository;
import com.andersenlab.crm.repositories.EmployeeArchiveRepository;
import com.andersenlab.crm.services.ArchiveService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Implementation of ArchiveService interface
 *
 * @see ArchiveService
 */
@Service
@AllArgsConstructor
public class ArchiveServiceImpl implements ArchiveService {

    private final EmployeeArchiveRepository employeeArchiveRepository;
    private final CompanyArchiveRepository companyArchiveRepository;
    private final ContactsArchiveRepository contactsArchiveRepository;
    private final CompanySaleArchiveRepository companySaleArchiveRepository;

    @Override
    public void saveToArchive(Employee employee) {
        EmployeeArchive archived = new EmployeeArchive();
        archived.setEmployee(employee);
        archived.setDate(LocalDateTime.now());
        employeeArchiveRepository.saveAndFlush(archived);
    }

    @Override
    public void saveToArchive(Company company) {
        CompanyArchive archived = new CompanyArchive();
        archived.setCompany(company);
        archived.setDateTime(LocalDateTime.now());
        companyArchiveRepository.saveAndFlush(archived);
    }

    @Override
    public void saveToArchive(Contact contact) {
        ContactsArchive archived = new ContactsArchive();
        archived.setContact(contact);
        archived.setDate(LocalDateTime.now());
        contactsArchiveRepository.saveAndFlush(archived);
    }

    @Override
    public void saveToArchive(CompanySale sale) {
        CompanySaleArchive archived = new CompanySaleArchive();
        archived.setCompanySale(sale);
        companySaleArchiveRepository.saveAndFlush(archived);
    }

    @Override
    public void removeArchive(CompanySale sale) {
        companySaleArchiveRepository.deleteByCompanySale(sale);
    }

    @Override
    public void removeArchive(Company company) {
        companyArchiveRepository.deleteByCompany(company);
    }

    @Override
    public void removeArchive(Employee employee) {
        employeeArchiveRepository.deleteByEmployee(employee);
    }

    @Override
    public void removeArchive(Contact contact) {
        contactsArchiveRepository.deleteByContact(contact);
    }
}
