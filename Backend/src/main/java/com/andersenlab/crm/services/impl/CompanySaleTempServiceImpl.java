package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.properties.TelegramProperties;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.CompanySaleTempRepository;
import com.andersenlab.crm.rest.dto.TelegramDto;
import com.andersenlab.crm.rest.response.SaleDistributionTimeResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanySaleTempService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.TelegramService;
import com.andersenlab.crm.services.distribution.CompanySaleDayDistributionService;
import com.andersenlab.crm.services.distribution.CompanySaleNightDistributionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.springframework.util.ObjectUtils.isEmpty;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanySaleTempServiceImpl implements CompanySaleTempService {
    private final TelegramProperties telegramProperties;

    private final EmployeeService employeeService;
    private final TelegramService telegramService;
    private final CompanySaleTempRepository companySaleTempRepository;
    private final CompanySaleDayDistributionService dayDistributionService;
    private final CompanySaleNightDistributionService nightDistributionService;

    private final AuthenticatedUser authenticatedUser;

    private LocalTime dayStatusFrom = LocalTime.of(9, 0, 0);
    private LocalTime dayStatusTo = LocalTime.of(18, 0, 0);

    @Override
    @Transactional
    public void createCompanySaleTempAndNotifier(CompanySale sale) {
        if (!companySaleTempRepository.existsByCompanySaleId(sale.getId())) {
            CompanySaleTemp saleTemp = createCompanySaleTemp(sale);
            companySaleTempRepository.saveAndFlush(saleTemp);

            if (CompanySaleTemp.Status.NIGHT.equals(saleTemp.getStatus())) {
                if (!nightDistributionService.checkForDistributionParticipants()) {
                    log.info("NIGHT DISTRIBUTION: Found no employees with distribution flag when resolving sale {}",
                            sale.getId());
                    nightDistributionService.notifyOnMissingDistributionParticipants(sale);
                }

                TelegramDto telegramDto = telegramService.createDto(sale.getId(), null);
                telegramService.send(telegramDto, telegramProperties.getUrl().getPostSale());
            }
            if (CompanySaleTemp.Status.DAY.equals(saleTemp.getStatus())) {
                sale.setInDayAutoDistribution(true);
                dayDistributionService.autoDistributionDayEmployee(sale, saleTemp);
            }

            sale.setTimeStatus(saleTemp.getStatus());
        } else {
            throw new CrmException(String.format("Specified sale %d is already in distribution", sale.getId()));
        }
    }

    private CompanySaleTemp createCompanySaleTemp(CompanySale companySale) {
        CompanySaleTemp saleTemp = new CompanySaleTemp();
        saleTemp.setCompanySale(companySale);
        saleTemp.setResponsible(employeeService.findByLogin("site"));
        saleTemp.setStatus(defineCompanySaleTempStatus());
        saleTemp.setIsSaleApproved(false);

        return saleTemp;
    }

    @Override
    public List<CompanySaleTemp> findAllByStatus(CompanySaleTemp.Status status) {
        return companySaleTempRepository.findAllByStatus(status);
    }

    @Override
    public List<CompanySaleTemp> findAllByStatusAndAssignmentDateNotNull(CompanySaleTemp.Status status) {
        return companySaleTempRepository.findAllByStatusAndAutoDistributionDateNotNullOrderById(status);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        companySaleTempRepository.delete(id);
    }

    @Override
    public void deleteByCorrespondingCompanySale(CompanySale companySale) {
        CompanySaleTemp saleTemp = companySaleTempRepository.findCompanySaleTempByCompanySaleId(companySale.getId());
        Optional.ofNullable(saleTemp).ifPresent(companySaleTempRepository::delete);
    }

    @Override
    @Transactional
    public void deleteOnArchivedSale(CompanySale companySale) {
        CompanySaleTemp companySaleTemp =
                companySaleTempRepository.findCompanySaleTempByCompanySaleId(companySale.getId());
        if (!isEmpty(companySaleTemp)) {
            deleteById(companySaleTemp.getId());
            log.info("AUTO DISTRIBUTION: Company sale {} with temp sale {} has been archived.",
                    companySale.getId(), companySaleTemp.getId());
            log.info("Removed sale from distribution algorithm.");
        }
    }

    @Override
    @Transactional
    public void acceptDistributionSale(Long companySaleId) {
        // For day distribution
        Employee currentEmployee = authenticatedUser.getCurrentEmployee();
        CompanySaleTemp saleTemp =
                companySaleTempRepository.findCompanySaleTempByCompanySaleId(companySaleId);
        if (Optional.ofNullable(saleTemp).isPresent()) {
            if (saleTemp.getResponsible().getId().equals(currentEmployee.getId())) {
                saleTemp.setIsSaleApproved(true);
                dayDistributionService.assignSaleToEmployee(saleTemp);
            } else {
                throw new CrmException("You can't approve the sale you're not assigned to");
            }
        } else {
            throw new ResourceNotFoundException("Sale not found, or it's not in auto distribution");
        }
    }

    @Override
    public SaleDistributionTimeResponse getDayDistributionTime() {
        SaleDistributionTimeResponse response = new SaleDistributionTimeResponse();
        response.setFrom(dayStatusFrom);
        response.setTo(dayStatusTo);
        return response;
    }

    @Override
    public void updateDayDistributionTime(LocalTime from, LocalTime to) {
        if (to.isBefore(from)) {
            throw new CrmException("Wrong time values: end time is before start time");
        }

        this.dayStatusFrom = from;
        this.dayStatusTo = to;
    }

    @Override
    public CompanySaleTemp.Status defineCompanySaleTempStatus() {
        LocalTime startTime = dayStatusFrom;
        LocalTime endTime = dayStatusTo;

        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.of("Etc/GMT-3"));
        LocalTime currentTime = currentDateTime.toLocalTime();
        if (currentDateTime.getDayOfWeek().equals(DayOfWeek.SATURDAY) || currentDateTime.getDayOfWeek().equals(DayOfWeek.SUNDAY)) {
            return CompanySaleTemp.Status.NIGHT;
        }

        if (currentTime.isAfter(endTime) || currentTime.isBefore(startTime)) {
            return CompanySaleTemp.Status.NIGHT;
        }

        return CompanySaleTemp.Status.DAY;
    }
}