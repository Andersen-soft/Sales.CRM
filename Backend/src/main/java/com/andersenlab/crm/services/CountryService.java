package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.rest.response.CountryDto;
import com.andersenlab.crm.rest.response.SaleReportCountryResponse;
import com.querydsl.core.types.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Locale;
import java.util.Set;

public interface CountryService {

    List<Country> findAll();

    Page<CountryDto> findAll(Predicate predicate, Pageable pageable, Locale locale);

    Page<SaleReportCountryResponse> findAllBySaleReport(Predicate predicate, Pageable pageable, Locale locale);

    Country findById(Long id);

    boolean exist(Long id);

    void validateById(Long id);

    Set<Country> getCountriesOrThrowException(List<Long> countryIds);

    Country getByAlpha2(String countryCode);

    Country defineByIp(String ip);

}
