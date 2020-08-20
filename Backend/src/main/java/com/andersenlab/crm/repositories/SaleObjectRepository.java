package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.SaleObject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleObjectRepository extends JpaRepository<SaleObject, Long> {
}
