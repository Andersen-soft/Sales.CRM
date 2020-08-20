package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.rest.response.SaleDistributionTimeResponse;

import java.time.LocalTime;
import java.util.List;

public interface CompanySaleTempService {
    void createCompanySaleTempAndNotifier(CompanySale sale);

    List<CompanySaleTemp> findAllByStatus(CompanySaleTemp.Status status);

    List<CompanySaleTemp> findAllByStatusAndAssignmentDateNotNull(CompanySaleTemp.Status status);

    void deleteByCorrespondingCompanySale(CompanySale companySale);

    void deleteById(Long id);

    SaleDistributionTimeResponse getDayDistributionTime();

    void updateDayDistributionTime(LocalTime from, LocalTime to);

    void deleteOnArchivedSale(CompanySale companySale);

    void acceptDistributionSale(Long companySaleId);

    CompanySaleTemp.Status defineCompanySaleTempStatus();
}