package com.andersenlab.crm.services.distribution;

import com.andersenlab.crm.events.CompanyDistributionReferenceDiffEvent;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanyDistributionHistory;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.services.CompanyDistributionHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.DISTRIBUTION_ALREADY_ASSIGNED;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.DISTRIBUTION_ASSIGNMENT;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.MANUAL_ASSIGNMENT;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.MANUAL_ASSIGNMENT_NO_QUEUE_UPDATE;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.REFERENCE_ASSIGNMENT;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.REFERENCE_DIFFERENT_DD_SPECIFIED;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.REFERENCE_SAME_DD_SPECIFIED;
import static java.util.Comparator.comparing;
import static java.util.Comparator.naturalOrder;
import static java.util.Comparator.nullsFirst;

/**
 * Service class containing methods to automatically assign responsible delivery directors
 * for companies.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CompanyDDDistributionService {
    private final CompanyDistributionHistoryService companyDistributionHistoryService;
    private final EmployeeRepository employeeRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void assignDeliveryDirector(Company company) {
        if (company.getResponsible() == null) {
            Employee nextDD = getNextDeliveryDirector();
            if (nextDD != null) {
                company.setResponsible(nextDD);
                nextDD.setDistributionDateRm(LocalDateTime.now());

                CompanyDistributionHistory history = companyDistributionHistoryService.buildHistory(
                        company,
                        null,
                        nextDD,
                        DISTRIBUTION_ASSIGNMENT
                );
                companyDistributionHistoryService.create(history);

                company.setDdAssignmentDate(LocalDateTime.now());
            }
        } else {
            CompanyDistributionHistory history = companyDistributionHistoryService.buildHistory(
                    company,
                    company.getResponsible(),
                    company.getResponsible(),
                    DISTRIBUTION_ALREADY_ASSIGNED
            );
            companyDistributionHistoryService.create(history);
        }
    }

    @Transactional
    public void assignDeliveryDirectorByReferenceCompany(CompanySale targetSale, Company referenceCompany) {
        Company targetCompany = targetSale.getCompany();
        if (referenceCompany != null && referenceCompany.getResponsible() != null) {
            if (targetCompany.getResponsible() == null) {
                Employee nextDD = referenceCompany.getResponsible();
                targetCompany.setResponsible(nextDD);
                targetCompany.setDdAssignmentDate(LocalDateTime.now());

                CompanyDistributionHistory history = companyDistributionHistoryService.buildHistoryWithReferenceCompany(
                        targetCompany,
                        referenceCompany,
                        null,
                        nextDD,
                        REFERENCE_ASSIGNMENT
                );
                companyDistributionHistoryService.create(history);
            } else {
                if (!targetCompany.getResponsible().equals(referenceCompany.getResponsible())) {
                    // This is the reason why we pass sale, not company, as method argument
                    eventPublisher.publishEvent(
                            CompanyDistributionReferenceDiffEvent.builder()
                                    .targetSale(targetSale)
                                    .referenceCompany(referenceCompany)
                                    .build()
                    );

                    CompanyDistributionHistory history = companyDistributionHistoryService.buildHistoryWithReferenceCompany(
                            targetCompany,
                            referenceCompany,
                            targetCompany.getResponsible(),
                            targetCompany.getResponsible(),
                            REFERENCE_DIFFERENT_DD_SPECIFIED
                    );
                    companyDistributionHistoryService.create(history);
                } else {
                    CompanyDistributionHistory history = companyDistributionHistoryService.buildHistoryWithReferenceCompany(
                            targetCompany,
                            referenceCompany,
                            targetCompany.getResponsible(),
                            targetCompany.getResponsible(),
                            REFERENCE_SAME_DD_SPECIFIED
                    );
                    companyDistributionHistoryService.create(history);
                }
            }
        } else {
            assignDeliveryDirector(targetCompany);
        }
    }

    @Transactional
    public void updateDistributionQueue(Company targetCompany, Employee newResponsible) {
        if (targetCompany.getDdAssignmentDate() == null
                || targetCompany.getDdAssignmentDate().isAfter(LocalDateTime.now().minusDays(3))) {
            Employee previousResponsible = targetCompany.getResponsible();
            if (previousResponsible != null) {
                previousResponsible.setDistributionDateRm(getTimeForFirstQueueParticipant());
            }
            newResponsible.setDistributionDateRm(LocalDateTime.now());

            CompanyDistributionHistory history = companyDistributionHistoryService.buildHistory(
                    targetCompany,
                    previousResponsible,
                    newResponsible,
                    MANUAL_ASSIGNMENT
            );
            companyDistributionHistoryService.create(history);
        } else {
            CompanyDistributionHistory history = companyDistributionHistoryService.buildHistory(
                    targetCompany,
                    targetCompany.getResponsible(),
                    newResponsible,
                    MANUAL_ASSIGNMENT_NO_QUEUE_UPDATE
            );
            companyDistributionHistoryService.create(history);
        }

        targetCompany.setDdAssignmentDate(LocalDateTime.now());
    }

    private Employee getNextDeliveryDirector() {
        List<Employee> queueDD = employeeRepository.findByResponsibleRMAndIsActiveTrue(true);
        return queueDD.stream()
                .min(nullsFirst(comparing(Employee::getDistributionDateRm, nullsFirst(naturalOrder())))
                        .thenComparing(Employee::getId))
                .orElse(null);
    }

    private LocalDateTime getTimeForFirstQueueParticipant() {
        List<Employee> allParticipants = employeeRepository.findByResponsibleRMAndIsActiveTrue(true);

        return allParticipants.stream()
                .min(nullsFirst(comparing(Employee::getDistributionDateRm, nullsFirst(naturalOrder()))))
                .map(Employee::getDistributionDateRm)
                .map(v -> v.minusMinutes(1))
                .orElse(null);
    }
}
