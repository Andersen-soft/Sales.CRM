package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.MailImportSaleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MailImportSaleHistoryRepository extends JpaRepository<MailImportSaleHistory, Long> {
    List<MailImportSaleHistory> findAllByCompanySaleId(long companySaleId);
}
