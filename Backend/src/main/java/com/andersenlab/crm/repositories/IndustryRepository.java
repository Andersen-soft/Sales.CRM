package com.andersenlab.crm.repositories;

import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.model.entities.QIndustry;

public interface IndustryRepository extends BaseRepository<QIndustry, Industry, Long> {

    Industry findByName(String name);
}
