package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.response.CompanyResponse;
import com.andersenlab.crm.rest.response.IndustryDto;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import com.andersenlab.crm.utils.ConverterHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import static java.util.Optional.ofNullable;


@Component
@RequiredArgsConstructor
public class CompanyToCompanyResponseConverter implements Converter<Company, CompanyResponse> {
    private final ConversionService conversionService;

    @Override
    public CompanyResponse convert(Company source) {
        CompanyResponse target = new CompanyResponse();
        target.setId(source.getId());
        target.setName(source.getName());
        target.setUrl(source.getUrl());
        target.setLinkedSales(ConverterHelper.getLinkedSales(source.getCompanySales()));
        target.setPhone(source.getPhone());
        target.setDescription(source.getDescription());
        target.setIndustryDtos(conversionService.convertToList(source.getIndustries(), IndustryDto.class));
        ofNullable(source.getResponsible())
                .ifPresent(responsible -> {
                    EmployeeResponse response = conversionService.convert(responsible, EmployeeResponse.class);
                    target.setResponsibleRm(response);
                });
        return target;
    }

    @Override
    public Class<Company> getSource() {
        return Company.class;
    }

    @Override
    public Class<CompanyResponse> getTarget() {
        return CompanyResponse.class;
    }
}
