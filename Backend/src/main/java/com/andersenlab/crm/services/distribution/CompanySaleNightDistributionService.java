package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.configuration.properties.TelegramProperties;
import com.andersenlab.crm.events.CompanySaleEmployeeSetMailEvent;
import com.andersenlab.crm.events.NightDistributionNoParticipantsEvent;
import com.andersenlab.crm.events.NightDistributionUnassignedSalesEvent;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EmployeeNightDistributionStackEntity;
import com.andersenlab.crm.repositories.CompanySaleTempRepository;
import com.andersenlab.crm.repositories.EmployeeNightDistributionStackEntityRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.rest.dto.TelegramDto;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.SaleRequestService;
import com.andersenlab.crm.services.TelegramService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsFirst;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanySaleNightDistributionService {
    private final EmployeeService employeeService;
    private final SaleRequestService saleRequestService;
    private final EmployeeRepository employeeRepository;
    private final TelegramService telegramService;
    private final CompanySaleTempRepository companySaleTempRepository;
    private final EmployeeNightDistributionStackEntityRepository stackEntityRepository;
    private final ApplicationEventPublisher eventPublisher;

    private final TelegramProperties telegramProperties;
    private final ApplicationProperties applicationProperties;

    @Transactional
    public void distributionSaleToEmployee(CompanySaleTemp saleTemp) {
        Employee responsibleEmployee = resolveResponsibleEmployeeByLikes(saleTemp);

        if (responsibleEmployee != null) {
            TelegramDto telegramDto = new TelegramDto();
            telegramDto.setChatId(telegramProperties.getChatId());
            telegramDto.setOrderId(saleTemp.getCompanySale().getId());
            telegramDto.setUserName(responsibleEmployee.getTelegramUsername());

            assignResponsibleEmployee(saleTemp, responsibleEmployee);
            telegramService.send(telegramDto, telegramProperties.getUrl().getPostAssignmentEmployee());
            companySaleTempRepository.delete(saleTemp.getId());
            log.info("NIGHT DISTRIBUTION: Removed temp sale {}", saleTemp.getId());
        } else {
            log.info("NIGHT DISTRIBUTION: Attempt to assign employee for company sale {} with empty queue.", saleTemp.getCompanySale().getId());
        }
    }

    @Transactional
    public void assignResponsibleEmployee(CompanySaleTemp saleTemp, Employee responsibleEmployee) {
        responsibleEmployee.setNightDistributionDate(LocalDateTime.now());
        saleTemp.setResponsible(responsibleEmployee);
        EmployeeNightDistributionStackEntity stackEntity = createStackEntity(responsibleEmployee);
        stackEntityRepository.save(stackEntity);
        responsibleEmployee.getNightDistributionStack().add(stackEntity);
        employeeService.saveEmployee(responsibleEmployee);

        CompanySale companySale = saleTemp.getCompanySale();
        companySale.setResponsible(responsibleEmployee);
        companySale.setLotteryDate(LocalDateTime.now());

        saleRequestService.assignResponsibleForAllRequestsByCompanySale(companySale, responsibleEmployee);
        log.info("NIGHT DISTRIBUTION: Assigned companySale {} to employee {}",
                saleTemp.getCompanySale().getId(), responsibleEmployee.getId());
        mailNotification(saleTemp);
    }

    @Transactional
    public Long onEmployeeLikeForTelegramSale(TelegramDto telegramDto) {
        Employee employee = employeeRepository.findEmployeeByTelegramUsername(telegramDto.getUserName());
        validateLikedEmployee(employee);

        Employee targetEmployee;
        if (isEmployeeSalesAssistant(employee)) {
            targetEmployee = employee.getMentor();
        } else {
            targetEmployee = employee;
        }

        CompanySaleTemp saleTemp = companySaleTempRepository.findCompanySaleTempByCompanySaleId(telegramDto.getOrderId());
        if (saleTemp != null) {
            if (saleTemp.getAutoDistributionDate() == null) {
                saleTemp.setAutoDistributionDate(LocalDateTime.now());
            }

            saleTemp.addEmployeeLike(targetEmployee);

            log.info("NIGHT DISTRIBUTION: Employee {} has added a like for company sale {} with sale temp {}",
                    targetEmployee.getId(), saleTemp.getCompanySale().getId(), saleTemp.getId());
            return saleTemp.getId();
        } else {
            throw new CrmException("Sale doesn't exist");
        }
    }

    public boolean checkForDistributionParticipants() {
        return !employeeRepository.findAllByNightDistributionParticipantIsTrueAndIsActiveTrue().isEmpty();
    }

    public void notifyOnMissingDistributionParticipants(CompanySale companySale) {
        eventPublisher.publishEvent(NightDistributionNoParticipantsEvent.builder()
                .companySale(companySale)
                .build());
    }

    public void updateQueueOnManualResponsibleChange(CompanySale companySale, Employee newResponsible) {
        LocalDateTime now = LocalDateTime.from(LocalDateTime.now())
                .atZone(ZoneId.of(applicationProperties.getTimezone()))
                .toLocalDateTime();
        if (companySale.getLotteryDate() != null
                && companySale.getLotteryDate().isAfter(now.minusDays(1))) {
            Employee currentResponsible = companySale.getResponsible();
            if (currentResponsible.isNightDistributionParticipant()) {
                if (!currentResponsible.getNightDistributionStack().isEmpty()) {
                    resolveWithPreviousStackTime(currentResponsible);
                } else {
                    currentResponsible.setNightDistributionDate(getTimeForFirstParticipant());
                }
            }

            if (newResponsible.isNightDistributionParticipant()) {
                newResponsible.setNightDistributionDate(now);
                EmployeeNightDistributionStackEntity stackEntity = createStackEntity(newResponsible);
                stackEntityRepository.save(stackEntity);
                newResponsible.getNightDistributionStack().add(stackEntity);
            }
        }
    }

    public void updateQueueOnArchivedSale(CompanySale companySale) {
        LocalDateTime now = LocalDateTime.from(LocalDateTime.now())
                .atZone(ZoneId.of(applicationProperties.getTimezone()))
                .toLocalDateTime();
        if (companySale.getLotteryDate() != null
                && companySale.getLotteryDate().isAfter(now.minusDays(1))) {
            Employee currentResponsible = companySale.getResponsible();
            if (currentResponsible.isNightDistributionParticipant()) {
                if (!currentResponsible.getNightDistributionStack().isEmpty()) {
                    resolveWithPreviousStackTime(currentResponsible);
                } else {
                    currentResponsible.setNightDistributionDate(getTimeForFirstParticipant());
                }
            }
        }
    }

    private Employee resolveResponsibleEmployeeByLikes(CompanySaleTemp saleTemp) {
        return saleTemp.getEmployeesLiked().stream()
                .min(Comparator.nullsFirst(Comparator.comparing(Employee::getNightDistributionDate, Comparator.nullsFirst(naturalOrder()))
                        .thenComparing(Employee::getId)))
                .orElse(saleTemp.getResponsible());
    }

    private void validateLikedEmployee(Employee employee) {
        if (employee != null) {
            Employee targetEmployee;
            if (isEmployeeSalesAssistant(employee)) {
                targetEmployee = employee.getMentor();
            } else {
                targetEmployee = employee;
            }

            if (!targetEmployee.isNightDistributionParticipant()) {
                throw new CrmException("Employee can't be added for distribution");
            }
        } else {
            throw new CrmException("There's no registered user with specified telegram name");
        }
    }

    private boolean isEmployeeSalesAssistant(Employee employee) {
        return employee.getRoles().stream()
                .anyMatch(e -> e.getName().equals(RoleEnum.ROLE_SALES_ASSISTANT))
                && employee.getMentor() != null;
    }

    private void mailNotification(CompanySaleTemp saleTemp) {
        eventPublisher.publishEvent(CompanySaleEmployeeSetMailEvent
                .builder()
                .saleId(saleTemp.getCompanySale().getId())
                .userName(Objects.toString(saleTemp.getResponsible().getFirstName(), "") + " " +
                        Objects.toString(saleTemp.getResponsible().getLastName(), "") + " " +
                        Objects.toString(saleTemp.getResponsible().getMiddleName(), ""))
                .userEmail(saleTemp.getResponsible().getEmail())
                .userLocale(saleTemp.getResponsible().getEmployeeLang())
                .companyName(saleTemp.getCompanySale().getCompanyName())
                .build());
    }

    @Transactional(readOnly = true)
    public void notifyAboutUnassignedNightDistributionSales() {
        List<CompanySaleTemp> nightDistributionSales = companySaleTempRepository.findAllByStatus(CompanySaleTemp.Status.NIGHT);
        List<CompanySale> unassignedSales = nightDistributionSales.stream()
                .filter(c -> c.getAutoDistributionDate() == null)
                .map(CompanySaleTemp::getCompanySale)
                .collect(Collectors.toList());

        if (!unassignedSales.isEmpty()) {
            eventPublisher.publishEvent(NightDistributionUnassignedSalesEvent.builder()
                    .unassignedSales(unassignedSales)
                    .build());
        }
    }

    private EmployeeNightDistributionStackEntity createStackEntity(Employee employee) {
        LocalDateTime now = LocalDateTime.from(LocalDateTime.now())
                .atZone(ZoneId.of(applicationProperties.getTimezone()))
                .toLocalDateTime();
        EmployeeNightDistributionStackEntity stackEntity = new EmployeeNightDistributionStackEntity();
        stackEntity.setEmployee(employee);
        stackEntity.setTime(now);

        return stackEntity;
    }

    private void resolveWithPreviousStackTime(Employee employee) {
        EmployeeNightDistributionStackEntity currentPosition = employee.getNightDistributionStack()
                .get(employee.getNightDistributionStack().size() - 1);
        employee.getNightDistributionStack().remove(currentPosition);
        stackEntityRepository.delete(currentPosition);

        if (!employee.getNightDistributionStack().isEmpty()) {
            EmployeeNightDistributionStackEntity previousPosition = employee.getNightDistributionStack()
                    .get(employee.getNightDistributionStack().size() - 1);
            LocalDateTime previousPositionTime = previousPosition.getTime();
            employee.setNightDistributionDate(previousPositionTime);
        } else {
            employee.setNightDistributionDate(getTimeForFirstParticipant());
        }
    }

    private LocalDateTime getTimeForFirstParticipant() {
        List<Employee> nightDistributionParticipants = employeeRepository.findAllByNightDistributionParticipantIsTrueAndIsActiveTrue();
        return nightDistributionParticipants.stream()
                .min(nullsFirst(comparing(Employee::getNightDistributionDate, nullsFirst(naturalOrder()))))
                .map(Employee::getNightDistributionDate)
                .map(date -> date.minusMinutes(1))
                .orElse(null);
    }
}
