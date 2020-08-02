package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.CompanyHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanyHistoryRepository extends JpaRepository<CompanyHistory, Long> {

    @Query("select history from CompanyHistory history " +
            "join history.company company " +
            "where company.id = :companyId")
    List<CompanyHistory> findAllByCompanyId(@Param("companyId") Long companyId);
}
