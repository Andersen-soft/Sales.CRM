package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.configuration.properties.SaleDistributionProperties;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.distribution.CompanySaleDayDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleNightDistributionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Log4j2
@Component
@RequiredArgsConstructor
public class SalesDistributionScheduler {
    private final CompanySaleTempService companySaleTempService;
    private final CompanySaleDayDistributionService dayDistributionService;
    private final CompanySaleNightDistributionService nightDistributionService;

    private final SaleDistributionProperties distributionProperties;

    @Scheduled(cron = "#{schedulerProperties.cronDayDistribution}", zone = "GMT+3")
    @Transactional
    public void workingHours() {
        log.info("DAY DISTRIBUTION: Scheduler algorithm start");
        List<CompanySaleTemp> allByStatusAndAssignmentDateNotNull =
                companySaleTempService.findAllByStatus(CompanySaleTemp.Status.DAY);
        LocalDateTime currentDateTime = LocalDateTime.from(LocalDateTime.now().atZone(ZoneId.of("GMT+3")));

        // !-- Проверка аппрувнутых продаж ---
        allByStatusAndAssignmentDateNotNull.stream()
                .filter(CompanySaleTemp::getIsSaleApproved)
                .forEach(dayDistributionService::assignSaleToEmployee);

        // !-- Проверка продаж, которые не успели аппрувнуть ---
        allByStatusAndAssignmentDateNotNull.stream()
                .filter(c -> (c.getAutoDistributionDate() == null
                        || c.getAutoDistributionDate().truncatedTo(ChronoUnit.MINUTES)
                        .isBefore(currentDateTime.minusMinutes(distributionProperties.getLifetimeDayDistribution())))
                        && !c.getIsSaleApproved())
                .forEach(saleTemp -> dayDistributionService.autoDistributionDayEmployee(saleTemp.getCompanySale(), saleTemp));
    }

    @Scheduled(cron = "#{schedulerProperties.cronNightDistribution}", zone = "GMT+3")
    @Transactional
    public void nonWorkingHours() {
        log.info("NIGHT DISTRIBUTION: Scheduler algorithm start");
        List<CompanySaleTemp> allByStatusAndAssignmentDateNotNull = companySaleTempService.findAllByStatusAndAssignmentDateNotNull(CompanySaleTemp.Status.NIGHT);
        LocalDateTime currentDateTime = LocalDateTime.from(LocalDateTime.now().atZone(ZoneId.of("GMT+3")));
        allByStatusAndAssignmentDateNotNull.stream()
                .filter(c -> c.getAutoDistributionDate().truncatedTo(ChronoUnit.MINUTES)
                        .isBefore(currentDateTime.minusMinutes(distributionProperties.getLifetimeNightDistribution())))
                .forEach(nightDistributionService::distributionSaleToEmployee);
    }

    @Scheduled(cron = "#{schedulerProperties.cronNightDistributionMailNotifier}", zone = "GMT+3")
    @Transactional(readOnly = true)
    public void notifyAboutUnassignedNightDistributionSales() {
        log.info("NIGHT DISTRIBUTION: Unassigned sales notifier start");
        nightDistributionService.notifyAboutUnassignedNightDistributionSales();
    }
}