package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.CompanySaleTemp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanySaleTempRepository extends JpaRepository<CompanySaleTemp, Long> {

    List<CompanySaleTemp> findAllByStatus(CompanySaleTemp.Status status);

    List<CompanySaleTemp> findAllByStatusAndAutoDistributionDateNotNullOrderById(CompanySaleTemp.Status status);

    CompanySaleTemp findCompanySaleTempByCompanySaleId(Long saleId);

    boolean existsByCompanySaleId(Long saleId);

    List<CompanySaleTemp> findAllByResponsibleId(Long responsibleId);
}