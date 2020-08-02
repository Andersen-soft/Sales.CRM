package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanyDistributionHistory;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.CompanyDistributionHistoryRepository;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.CompanyDistributionHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.DISTRIBUTION_ALREADY_ASSIGNED;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.DISTRIBUTION_ASSIGNMENT;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.REFERENCE_ASSIGNMENT;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.REFERENCE_DIFFERENT_DD_SPECIFIED;
import static com.andersenlab.crm.model.entities.CompanyDistributionHistory.CompanyDistributionEvent.REFERENCE_SAME_DD_SPECIFIED;
import static com.andersenlab.crm.utils.CrmConstants.CRM_BOT_LOGIN;

@Service
@RequiredArgsConstructor
public class CompanyDistributionHistoryServiceImpl implements CompanyDistributionHistoryService {
    private final CompanyDistributionHistoryRepository companyDistributionHistoryRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthenticatedUser authenticatedUser;

    @Override
    @Transactional
    public CompanyDistributionHistory create(CompanyDistributionHistory history) {
        return companyDistributionHistoryRepository.save(history);
    }

    @Override
    public CompanyDistributionHistory buildHistory(
            Company company,
            Employee previousDD,
            Employee newDD,
            CompanyDistributionHistory.CompanyDistributionEvent event
    ) {
        CompanyDistributionHistory history = new CompanyDistributionHistory();
        history.setEventDate(LocalDateTime.now());
        history.setCompany(company);
        history.setReferenceDD(null);
        if (isEventAutoAssignment(event)) {
            history.setAuthor(employeeRepository.findEmployeeByLogin(CRM_BOT_LOGIN));
        } else {
            history.setAuthor(authenticatedUser.getCurrentEmployee());
        }
        history.setEvent(event);
        history.setCurrentDD(newDD);
        history.setPreviousDD(previousDD);
        return history;
    }

    @Override
    public CompanyDistributionHistory buildHistoryWithReferenceCompany(
            Company company,
            Company referenceCompany,
            Employee previousDD,
            Employee newDD,
            CompanyDistributionHistory.CompanyDistributionEvent event
    ) {
        CompanyDistributionHistory history = buildHistory(
                company,
                previousDD,
                newDD,
                event
        );
        history.setReferenceDD(referenceCompany.getResponsible());
        return history;
    }

    private boolean isEventAutoAssignment(CompanyDistributionHistory.CompanyDistributionEvent event) {
        boolean assignedByQueue = DISTRIBUTION_ASSIGNMENT.equals(event)
                || DISTRIBUTION_ALREADY_ASSIGNED.equals(event)
                || REFERENCE_ASSIGNMENT.equals(event);

        boolean assignedByReference = REFERENCE_SAME_DD_SPECIFIED.equals(event)
                || REFERENCE_DIFFERENT_DD_SPECIFIED.equals(event);
        return assignedByQueue || assignedByReference;
    }
}
