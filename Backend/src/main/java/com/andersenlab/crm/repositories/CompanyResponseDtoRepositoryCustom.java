package com.andersenlab.crm.repositories;

import com.andersenlab.crm.dsl.CustomQueryDslJpaRepository;
import com.andersenlab.crm.model.entities.Company;

public interface CompanyResponseDtoRepositoryCustom extends CustomQueryDslJpaRepository<Company, Long> {
}