package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.MailImportSaleHistory;
import com.andersenlab.crm.rest.dto.MailImportSaleRequest;

import java.util.List;

public interface MailImportSaleHistoryService {
    List<MailImportSaleHistory> findAll();

    List<MailImportSaleHistory> findAllByCompanySale(CompanySale companySale);

    MailImportSaleHistory createHistory(MailImportSaleHistory history);

    MailImportSaleHistory createFromRequest(MailImportSaleRequest request, CompanySale createdSale, MailImportSaleHistory.MailImportSaleResult result);
}
