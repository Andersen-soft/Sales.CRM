package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.rest.request.CompanyCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyCreateRequestToCompanyConverter implements Converter<CompanyCreateRequest, Company> {
    private final ConversionService conversionService;

    @Override
    public Company convert(CompanyCreateRequest source) {
        Company target = new Company();
        target.setName(source.getName());
        target.setUrl(source.getUrl());
        target.setPhone(source.getPhone());
        target.setDescription(source.getDescription());
        if (source.getIndustryCreateRequestList() != null) {
            target.setIndustries(conversionService.convertToList(source.getIndustryCreateRequestList(), Industry.class));
        }
        return target;
    }

    @Override
    public Class<CompanyCreateRequest> getSource() {
        return CompanyCreateRequest.class;
    }

    @Override
    public Class<Company> getTarget() {
        return Company.class;
    }
}
