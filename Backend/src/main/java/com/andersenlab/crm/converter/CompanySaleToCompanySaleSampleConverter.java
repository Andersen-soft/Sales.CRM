package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.CompanySale;
import com.andersenlab.crm.rest.sample.CompanySaleSample;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import static com.andersenlab.crm.utils.ConverterHelper.getNullable;

@Component
@AllArgsConstructor
public class CompanySaleToCompanySaleSampleConverter implements Converter<CompanySale, CompanySaleSample> {

    @Override
    public CompanySaleSample convert(CompanySale source) {
        CompanySaleSample target = new CompanySaleSample();
        target.setCreateDate(source.getCreateDate());
        target.setDescription(source.getDescription());
        target.setId(source.getId());
        target.setNextActivityDate(source.getNextActivityDate());
        target.setStatus(getNullable(source.getStatus(), CompanySale.Status::getName));
        return target;
    }

    @Override
    public Class<CompanySale> getSource() {
        return CompanySale.class;
    }

    @Override
    public Class<CompanySaleSample> getTarget() {
        return CompanySaleSample.class;
    }
}
