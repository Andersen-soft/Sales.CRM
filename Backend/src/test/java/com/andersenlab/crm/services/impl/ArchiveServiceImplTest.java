package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.*;
import com.andersenlab.crm.repositories.CompanyArchiveRepository;
import com.andersenlab.crm.repositories.CompanySaleArchiveRepository;
import com.andersenlab.crm.repositories.ContactsArchiveRepository;
import com.andersenlab.crm.repositories.EmployeeArchiveRepository;
import org.junit.Test;
import org.mockito.Matchers;

import static org.mockito.Mockito.*;

public class ArchiveServiceImplTest {
    private EmployeeArchiveRepository employeeArchiveRepository = mock(EmployeeArchiveRepository.class);
    private CompanyArchiveRepository companyArchiveRepository = mock(CompanyArchiveRepository.class);
    private ContactsArchiveRepository contactsArchiveRepository = mock(ContactsArchiveRepository.class);
    private CompanySaleArchiveRepository companySaleArchiveRepository = mock(CompanySaleArchiveRepository.class);

    private ArchiveServiceImpl archiveService = new ArchiveServiceImpl(employeeArchiveRepository,
            companyArchiveRepository,
            contactsArchiveRepository,
            companySaleArchiveRepository);


    @Test
    public void testSaveToArchive() {
        CompanySale sale = new CompanySale();
        Employee employee = new Employee();
        Contact contact = new Contact();
        Company company = new Company();

        archiveService.saveToArchive(company);
        archiveService.saveToArchive(contact);
        archiveService.saveToArchive(sale);
        archiveService.saveToArchive(employee);

        verify(employeeArchiveRepository, times(1)).saveAndFlush(Matchers.any(EmployeeArchive.class));
        verify(contactsArchiveRepository, times(1)).saveAndFlush(Matchers.any(ContactsArchive.class));
        verify(companySaleArchiveRepository, times(1)).saveAndFlush(Matchers.any(CompanySaleArchive.class));
        verify(companyArchiveRepository, times(1)).saveAndFlush(Matchers.any(CompanyArchive.class));
    }

    @Test
    public void testRemoveArchive() {
        CompanySale sale = new CompanySale();
        Employee employee = new Employee();
        Contact contact = new Contact();
        Company company = new Company();

        archiveService.removeArchive(company);
        archiveService.removeArchive(contact);
        archiveService.removeArchive(sale);
        archiveService.removeArchive(employee);

        verify(employeeArchiveRepository, times(1)).deleteByEmployee(employee);
        verify(contactsArchiveRepository, times(1)).deleteByContact(contact);
        verify(companySaleArchiveRepository, times(1)).deleteByCompanySale(sale);
        verify(companyArchiveRepository, times(1)).deleteByCompany(company);
    }
}