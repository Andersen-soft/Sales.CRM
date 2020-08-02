package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.services.AutoResponsibleRmService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AutoResponsibleRmServiceImpl implements AutoResponsibleRmService {

    private final EmployeeRepository employeeRepository;

    @Override
    public Employee autoResponsibleRmEmployee() {
        List<Employee> byResponsibleRm = employeeRepository.findByResponsibleRMAndIsActiveTrue(true);
        return byResponsibleRm.stream()
                .min(Comparator.nullsFirst(Comparator.comparing(Employee::getDistributionDateRm)))
                .orElse(null);
    }
}
