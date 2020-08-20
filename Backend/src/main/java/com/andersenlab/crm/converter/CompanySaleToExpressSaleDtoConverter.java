package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.rest.response.ExpressSaleDto;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CompanySaleToExpressSaleDtoConverter implements Converter<CompanySale, ExpressSaleDto> {
    @Override
    public ExpressSaleDto convert(CompanySale source) {
        ExpressSaleDto target = new ExpressSaleDto();
        Optional.ofNullable(source.getId()).ifPresent(target::setId);
        Optional.ofNullable(source.getCompany()).ifPresent(s -> target.setCompanyName(s.getName()));
        return target;
    }

    @Override
    public Class<CompanySale> getSource() {
        return CompanySale.class;
    }

    @Override
    public Class<ExpressSaleDto> getTarget() {
        return ExpressSaleDto.class;
    }
}
