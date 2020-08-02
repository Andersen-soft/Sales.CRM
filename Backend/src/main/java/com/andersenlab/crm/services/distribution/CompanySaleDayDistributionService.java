package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.events.DayDistributionEmployeeSetEvent;
import com.andersenlab.crm.events.DayDistributionNoParticipantsEvent;
import com.andersenlab.crm.events.DayDistributionRejectedSaleEvent;
import com.andersenlab.crm.events.DayDistributionSaleRemovedEvent;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.CompanySaleTempRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.rest.dto.DayDistributionEmployeeDto;
import com.andersenlab.crm.services.SaleRequestService;
import com.andersenlab.crm.services.WsSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static com.andersenlab.crm.utils.CrmTopicConstants.TOPIC_AUTO_DISTRIBUTION_DAY_EMPLOYEE_ASSIGNED;
import static com.andersenlab.crm.utils.CrmTopicConstants.TOPIC_AUTO_DISTRIBUTION_DAY_SALE_REMOVED;
import static com.andersenlab.crm.utils.ServiceUtils.isEmployeeCrmBot;
import static java.util.Comparator.comparing;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsFirst;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanySaleDayDistributionService {
    private final EmployeeRepository employeeRepository;
    private final CompanySaleTempRepository companySaleTempRepository;
    private final SaleRequestService saleRequestService;
    private final ApplicationEventPublisher eventPublisher;
    private final WsSender wsSender;

    @Transactional
    public void autoDistributionDayEmployee(CompanySale sale, CompanySaleTemp saleTemp) {
        Employee currentEmployee = saleTemp.getResponsible();
        if (!isEmployeeCrmBot(currentEmployee)) {
            notifyAboutRejectedSale(currentEmployee, sale);
        }
        Employee lotteryDayEmployee = getNextEmployeeForSaleTemp(saleTemp);
        if (lotteryDayEmployee != null) {
            saleTemp.setResponsible(lotteryDayEmployee);
            saleTemp.setAutoDistributionDate(LocalDateTime.now());
            lotteryDayEmployee.setDayDistributionDate(LocalDateTime.now());
            currentEmployee.setDayDistributionDate(getTimeForFirstQueueParticipant());
            // !-- Assign responsible for company sale if needed --

            wsSender.getSender(TOPIC_AUTO_DISTRIBUTION_DAY_EMPLOYEE_ASSIGNED)
                    .accept(createDayDistributionDto(sale, lotteryDayEmployee));

            notifyEmployee(lotteryDayEmployee, sale);
            log.info("DAY DISTRIBUTION: Distributed companySale {} with saleTemp {} to employee {}",
                    sale.getId(), saleTemp.getId(), lotteryDayEmployee.getId());
        } else {
            onMissingDayDistributionEmployees(sale);
        }
    }

    @Transactional
    public void assignSaleToEmployee(CompanySaleTemp saleTemp) {
        Employee responsible = saleTemp.getResponsible();
        responsible.setDayDistributionDate(LocalDateTime.now());

        CompanySale sale = saleTemp.getCompanySale();
        sale.setResponsible(responsible);
        sale.setLotteryDate(LocalDateTime.now());
        sale.setInDayAutoDistribution(false);

        companySaleTempRepository.delete(saleTemp);
        saleRequestService.assignResponsibleForAllRequestsByCompanySale(sale, responsible);
        log.info("DAY DISTRIBUTION: Assigned companySale {} to employee {}",
                saleTemp.getCompanySale().getId(), saleTemp.getResponsible().getId());
    }

    @Transactional
    public void updateQueueOnManualResponsibleChange(CompanySale saleFor, Employee newResponsible) {
        LocalDateTime now = LocalDateTime.from(LocalDateTime.now()).atZone(ZoneId.of("GMT+3")).toLocalDateTime();
        if (saleFor.getLotteryDate() == null
                || now.minusDays(3).isBefore(saleFor.getLotteryDate())) {
            Employee currentResponsible = saleFor.getResponsible();
            if (currentResponsible.isDayDistributionParticipant()) {
                currentResponsible.setDayDistributionDate(getTimeForFirstQueueParticipant());
            }
            if (newResponsible.isDayDistributionParticipant()) {
                newResponsible.setDayDistributionDate(now);
            }
        }
    }

    @Transactional
    public void updateQueueOnArchivedSale(CompanySale saleFor) {
        LocalDateTime now = LocalDateTime.from(LocalDateTime.now()).atZone(ZoneId.of("GMT+3")).toLocalDateTime();
        if (saleFor.getLotteryDate() == null
                || now.minusDays(3).isBefore(saleFor.getLotteryDate())) {
            Employee currentResponsible = saleFor.getResponsible();
            if (currentResponsible.isDayDistributionParticipant()) {
                currentResponsible.setDayDistributionDate(getTimeForFirstQueueParticipant());
            }
        }
    }

    @Transactional
    public void updateQueueOnSaleRemovedFromDistribution(CompanySale companySale) {
        CompanySaleTemp saleTemp = companySaleTempRepository.findCompanySaleTempByCompanySaleId(
                companySale.getId());
        Employee assignedEmployee = saleTemp.getResponsible();
        assignedEmployee.setDayDistributionDate(getTimeForFirstQueueParticipant());
    }

    @Transactional(readOnly = true)
    public void notifyAboutCompanySaleRemovedFromDistribution(CompanySale companySale) {
        CompanySaleTemp saleTemp = companySaleTempRepository.findCompanySaleTempByCompanySaleId(
                companySale.getId());
        Employee assignedEmployee = saleTemp.getResponsible();

        wsSender.getSender(TOPIC_AUTO_DISTRIBUTION_DAY_SALE_REMOVED)
                .accept(createDayDistributionDto(companySale, assignedEmployee));

        eventPublisher.publishEvent(DayDistributionSaleRemovedEvent.builder()
                .employee(assignedEmployee)
                .companySale(companySale)
                .build());
    }

    private LocalDateTime getTimeForFirstQueueParticipant() {
        List<Employee> allParticipants = getDayDistributionParticipants();
        return allParticipants.stream()
                .min(nullsFirst(comparing(Employee::getDayDistributionDate, nullsFirst(naturalOrder()))))
                .map(Employee::getDayDistributionDate)
                .map(v -> v.minusMinutes(1))
                .orElse(null);
    }

    private void notifyAboutRejectedSale(Employee currentEmployee, CompanySale sale) {
        eventPublisher.publishEvent(DayDistributionRejectedSaleEvent.builder()
                .employee(currentEmployee)
                .companySale(sale)
                .build());
    }

    private void notifyEmployee(Employee lotteryDayEmployee, CompanySale sale) {
        eventPublisher.publishEvent(DayDistributionEmployeeSetEvent.builder()
                .employee(lotteryDayEmployee)
                .companySale(sale)
                .build());
    }

    private void onMissingDayDistributionEmployees(CompanySale companySale) {
        log.info("DAY DISTRIBUTION: Found no employees with distribution flag when resolving sale {}",
                companySale.getId());
        eventPublisher.publishEvent(DayDistributionNoParticipantsEvent.builder()
                .companySale(companySale)
                .build());
    }

    private DayDistributionEmployeeDto createDayDistributionDto(CompanySale companySale, Employee employee) {
        return new DayDistributionEmployeeDto(
                companySale.getId(),
                employee.getId(),
                companySale.getCompany().getName()
        );
    }

    private Employee getNextEmployeeForSaleTemp(CompanySaleTemp saleTemp) {
        Set<Employee> dayDistributionQueue = saleTemp.getDayDistributionQueue();
        Employee currentEmployee = saleTemp.getResponsible();
        dayDistributionQueue.remove(currentEmployee);

        if (dayDistributionQueue.isEmpty()) {
            dayDistributionQueue.addAll(getDayDistributionParticipants());
            log.info("DAY DISTRIBUTION: Created new queue for companySale {} with saleTemp {}",
                    saleTemp.getCompanySale().getId(), saleTemp.getId());
        }

        Optional<Employee> next = dayDistributionQueue.stream()
                .min(nullsFirst(comparing(Employee::getDayDistributionDate, nullsFirst(naturalOrder())))
                        .thenComparing(Employee::getId));

        return next.orElse(null);
    }

    private List<Employee> getDayDistributionParticipants() {
        return employeeRepository.findAllByDayDistributionParticipantIsTrueAndIsActiveTrue();
    }
}
