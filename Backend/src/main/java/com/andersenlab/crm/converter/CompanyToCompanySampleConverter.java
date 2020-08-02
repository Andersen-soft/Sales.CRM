package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.sample.CompanySample;
import org.springframework.stereotype.Component;

@Component
public class CompanyToCompanySampleConverter implements Converter<Company, CompanySample> {

    @Override
    public CompanySample convert(Company source) {
        CompanySample target = new CompanySample();
        target.setIsActive(source.getIsActive());
        target.setDescription(source.getDescription());
        target.setId(source.getId());
        target.setName(source.getName());
        target.setUrl(source.getUrl());
        return target;
    }

    @Override
    public Class<Company> getSource() {
        return Company.class;
    }

    @Override
    public Class<CompanySample> getTarget() {
        return CompanySample.class;
    }
}
