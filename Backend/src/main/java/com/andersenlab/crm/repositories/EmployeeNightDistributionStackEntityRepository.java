package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.EmployeeNightDistributionStackEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Generic repository for employee night distribution stack entity.
 */
public interface EmployeeNightDistributionStackEntityRepository
        extends JpaRepository<EmployeeNightDistributionStackEntity, Long> {
}
