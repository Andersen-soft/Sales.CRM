package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.MailImportSaleHistory;
import com.andersenlab.crm.repositories.MailImportSaleHistoryRepository;
import com.andersenlab.crm.rest.dto.MailImportSaleRequest;
import com.andersenlab.crm.services.MailImportSaleHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.andersenlab.crm.utils.CrmStringUtils.fixStringDescription;

@Service
@RequiredArgsConstructor
public class MailImportSaleHistoryServiceImpl implements MailImportSaleHistoryService {
    private final MailImportSaleHistoryRepository mailImportSaleHistoryRepository;

    @Override
    public List<MailImportSaleHistory> findAll() {
        return mailImportSaleHistoryRepository.findAll();
    }

    @Override
    public List<MailImportSaleHistory> findAllByCompanySale(CompanySale companySale) {
        return mailImportSaleHistoryRepository.findAllByCompanySaleId(companySale.getId());
    }

    @Override
    public MailImportSaleHistory createHistory(MailImportSaleHistory history) {
        return mailImportSaleHistoryRepository.save(history);
    }

    @Override
    public MailImportSaleHistory createFromRequest(MailImportSaleRequest request, CompanySale createdSale, MailImportSaleHistory.MailImportSaleResult result) {
        MailImportSaleHistory history = new MailImportSaleHistory();
        history.setCompanySale(createdSale);
        history.setContactEmail(request.getSender());
        history.setSalesEmail(request.getReceiver());
        history.setMessage(fixStringDescription(request.getBody()));
        history.setMailImportSaleResult(result);
        return createHistory(history);
    }
}
