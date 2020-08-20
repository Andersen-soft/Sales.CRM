package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Industry;
import com.andersenlab.crm.rest.response.IndustryDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class IndustryToIndustryResponseConverter implements Converter<Industry, IndustryDto> {

    @Override
    public IndustryDto convert(Industry source) {
        IndustryDto target = new IndustryDto();
        Optional.ofNullable(source.getId()).ifPresent(target::setId);
        Optional.ofNullable(source.getName()).ifPresent(target::setName);
        Optional.ofNullable(source.getCommon()).ifPresent(target::setCommon);
        return target;
    }

    @Override
    public Class<Industry> getSource() {
        return Industry.class;
    }

    @Override
    public Class<IndustryDto> getTarget() {
        return IndustryDto.class;
    }
}
