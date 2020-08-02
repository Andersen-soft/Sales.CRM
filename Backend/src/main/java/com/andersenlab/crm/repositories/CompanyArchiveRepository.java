package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanyArchive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyArchiveRepository extends JpaRepository<CompanyArchive, Long> {
    void deleteByCompany(Company company);
}
