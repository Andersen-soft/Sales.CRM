package com.andersenlab.crm.converter.company;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.response.CompanyDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CompanyToCompanyDto implements Converter<Company, CompanyDto> {

    @Override
    public CompanyDto convert(Company source) {
        CompanyDto target = new CompanyDto();
        Optional.ofNullable(source.getId()).ifPresent(target::setId);
        Optional.ofNullable(source.getName()).ifPresent(target::setName);
        return target;
    }

    @Override
    public Class<Company> getSource() {
        return Company.class;
    }

    @Override
    public Class<CompanyDto> getTarget() {
        return CompanyDto.class;
    }
}
