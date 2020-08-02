package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.model.entities.Employee;

public interface SaleRequestService {
    void assignResponsibleForAllRequestsByCompanySale(CompanySale companySale, Employee responsible);
}
