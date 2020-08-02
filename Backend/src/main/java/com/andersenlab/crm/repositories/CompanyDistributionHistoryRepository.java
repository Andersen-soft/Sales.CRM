package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.CompanyDistributionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyDistributionHistoryRepository extends JpaRepository<CompanyDistributionHistory, Long> {
}
