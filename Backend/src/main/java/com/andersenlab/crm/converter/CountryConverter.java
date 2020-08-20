package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.Country;
import com.andersenlab.crm.rest.response.CountryDto;

import java.util.Optional;

public class CountryConverter extends SimpleConverter<CountryDto, Country> {

    public CountryConverter() {
        super(CountryConverter::fromDto, CountryConverter::toDto);
    }

    private static Country fromDto(CountryDto dto) {
        Country entity = new Country();
        Optional.ofNullable(dto).ifPresent(o -> entity.setId(o.getId()));
        Optional.ofNullable(dto).ifPresent(o -> entity.setNameRu(o.getName()));
        return entity;
    }

    private static CountryDto toDto(Country entity) {
        final CountryDto dto = new CountryDto();
        Optional.ofNullable(entity).ifPresent(o -> dto.setId(o.getId()));
        Optional.ofNullable(entity).ifPresent(o -> dto.setName(o.getNameRu()));
        return dto;
    }
}
