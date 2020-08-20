package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.CompanySaleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompanySaleHistoryRepository extends JpaRepository<CompanySaleHistory, Long> {

    @Query("select history from CompanySaleHistory history " +
            "join history.companySale sale " +
            "where sale.id = :saleId")
    List<CompanySaleHistory> findAllByCompanySaleId(@Param("saleId") Long saleId);
}
