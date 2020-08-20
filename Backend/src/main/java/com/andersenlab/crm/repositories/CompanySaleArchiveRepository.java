package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleArchive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanySaleArchiveRepository extends JpaRepository<CompanySaleArchive, Long> {
    void deleteByCompanySale(CompanySale sale);
}
