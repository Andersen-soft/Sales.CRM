package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.CompanyDistributionHistory;
import com.andersenlab.crm.model.entities.Employee;

public interface CompanyDistributionHistoryService {
    CompanyDistributionHistory create(CompanyDistributionHistory history);

    CompanyDistributionHistory buildHistory(
            Company company,
            Employee previousDD,
            Employee newDD,
            CompanyDistributionHistory.CompanyDistributionEvent event
    );

    CompanyDistributionHistory buildHistoryWithReferenceCompany(
            Company company,
            Company referenceCompany,
            Employee previousDD,
            Employee newDD,
            CompanyDistributionHistory.CompanyDistributionEvent event
    );
}
