package com.andersenlab.crm.repositories;


import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.model.entities.QCountry;

public interface CountryRepository extends  BaseRepository<QCountry, Country, Long> {
    Country findByAlpha2(String countryCode);

}
