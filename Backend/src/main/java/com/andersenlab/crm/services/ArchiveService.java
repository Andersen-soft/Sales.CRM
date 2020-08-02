package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.*;

/**
 * Encapsulates business logic and persistence related to archives.
 *
 * @see Activity
 */
public interface ArchiveService {
    /**
     * Archives an employee
     *
     * @param employee the employee to archive
     */
    void saveToArchive(Employee employee);

    /**
     * Archives a company
     *
     * @param company the company to archive
     */
    void saveToArchive(Company company);

    /**
     * Archives a contact
     *
     * @param contact the contact to archive
     */
    void saveToArchive(Contact contact);

    void saveToArchive(CompanySale sale);

    void removeArchive(CompanySale sale);

    void removeArchive(Company company);

    void removeArchive(Employee employee);

    void removeArchive(Contact contact);
}
