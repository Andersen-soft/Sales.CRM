package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.events.CompanySaleEmployeeSetMailEvent;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.CompanySaleTemp;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.services.SaleRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import static com.andersenlab.crm.utils.ServiceUtils.employeeRolesContains;
import static java.util.Comparator.comparing;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsFirst;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompanySaleRegionalDistributionService {
    private final SaleRequestService saleRequestService;
    private final EmployeeRepository employeeRepository;
    private final ApplicationEventPublisher eventPublisher;

    private final ApplicationProperties applicationProperties;

    public void setResponsibleRegionalEmployeeAndMailNotify(CompanySale sale, Employee regionEmployee) {
        sale.setResponsible(regionEmployee);
        sale.setTimeStatus(CompanySaleTemp.Status.REGIONAL);

        LocalDateTime now = getCurrentTime();
        sale.setLotteryDate(now);
        regionEmployee.setRegionalDistributionDate(now);
        saleRequestService.assignResponsibleForAllRequestsByCompanySale(sale, regionEmployee);
        log.info("REGIONAL DISTRIBUTION: Assigned regional employee {} to company sale {}",
                regionEmployee.getId(), sale.getId());
        eventPublisher.publishEvent(CompanySaleEmployeeSetMailEvent
                .builder()
                .saleId(sale.getId())
                .userName(Objects.toString(regionEmployee.getFirstName(), "") + " " +
                        Objects.toString(regionEmployee.getLastName(), "") + " " +
                        Objects.toString(regionEmployee.getMiddleName(), ""))
                .userEmail(regionEmployee.getEmail())
                .userLocale(regionEmployee.getEmployeeLang())
                .companyName(sale.getCompany().getName())
                .build());
    }

    public Employee findNextRegionalEmployeeByCountry(Country country) {
        if (country != null) {
            return employeeRepository.findByCountriesAndIsActiveTrue(Collections.singletonList(country))
                    .stream()
                    .filter(employee -> employeeRolesContains(employee, RoleEnum.ROLE_SALES))
                    .min(Comparator.nullsFirst(comparing(Employee::getRegionalDistributionDate, Comparator.nullsFirst(Comparator.naturalOrder()))))
                    .orElse(null);
        } else {
            return null;
        }
    }

    @Transactional
    public void updateQueueOnManualResponsibleChange(CompanySale companySale, Employee newResponsible) {
        LocalDateTime now = getCurrentTime();
        if (companySale.getLotteryDate() == null
                || now.minusDays(3).isBefore(companySale.getLotteryDate())) {
            Employee currentResponsible = companySale.getResponsible();
            Country saleCountry = companySale.getMainContact().getCountry();
            List<Employee> regionalEmployees = employeeRepository.findByCountriesAndIsActiveTrue(
                    Collections.singletonList(saleCountry));

            if (regionalEmployees.size() > 1) {
                if (regionalEmployees.contains(newResponsible)) {
                    newResponsible.setRegionalDistributionDate(now);
                }
                if (regionalEmployees.contains(currentResponsible)) {
                    currentResponsible.setRegionalDistributionDate(getTimeForFirstQueueParticipant(regionalEmployees));
                }
            }
        }
    }

    @Transactional
    public void updateQueueOnArchivedSale(CompanySale companySale) {
        LocalDateTime now = getCurrentTime();
        if (companySale.getLotteryDate() == null
                || now.minusDays(3).isBefore(companySale.getLotteryDate())) {
            Employee currentResponsible = companySale.getResponsible();
            Country saleCountry = companySale.getMainContact().getCountry();
            List<Employee> regionalEmployees = employeeRepository.findByCountriesAndIsActiveTrue(
                    Collections.singletonList(saleCountry));

            if (regionalEmployees.size() > 1
                    && regionalEmployees.contains(currentResponsible)) {
                currentResponsible.setRegionalDistributionDate(getTimeForFirstQueueParticipant(regionalEmployees));
            }
        }
    }

    private LocalDateTime getTimeForFirstQueueParticipant(List<Employee> regionalQueue) {
        return regionalQueue.stream()
                .min(nullsFirst(comparing(Employee::getRegionalDistributionDate, nullsFirst(naturalOrder()))))
                .map(Employee::getRegionalDistributionDate)
                .map(v -> v.minusMinutes(1)).orElse(null);
    }

    private LocalDateTime getCurrentTime() {
        String timezone = applicationProperties.getTimezone();
        return LocalDateTime.from(LocalDateTime.now()).atZone(ZoneId.of(timezone)).toLocalDateTime();
    }
}
