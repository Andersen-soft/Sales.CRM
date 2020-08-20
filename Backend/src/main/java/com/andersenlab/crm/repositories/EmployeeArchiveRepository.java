package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.EmployeeArchive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeArchiveRepository extends JpaRepository<EmployeeArchive, Long> {
    void deleteByEmployee(Employee employee);
}
