package com.andersenlab.crm.converter.company;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Company;
import com.andersenlab.crm.rest.response.CompanyResponseSimple;
import com.andersenlab.crm.utils.ConverterHelper;
import org.springframework.stereotype.Component;

import static java.util.Optional.ofNullable;

@Component
public class CompanyToCompanyResponseSimple implements Converter<Company, CompanyResponseSimple> {

    @Override
    public CompanyResponseSimple convert(Company source) {
        CompanyResponseSimple target = new CompanyResponseSimple();
        ofNullable(source.getId()).ifPresent(target::setId);
        ofNullable(source.getName()).ifPresent(target::setName);
        ofNullable(source.getUrl()).ifPresent(target::setUrl);
        ofNullable(source.getDescription()).ifPresent(target::setDescription);
        ofNullable(source.getCompanySales()).ifPresent(s -> target.setLinkedSales(ConverterHelper.getLinkedSales(s)));
        return target;
    }

    @Override
    public Class<Company> getSource() {
        return Company.class;
    }

    @Override
    public Class<CompanyResponseSimple> getTarget() {
        return CompanyResponseSimple.class;
    }

}
