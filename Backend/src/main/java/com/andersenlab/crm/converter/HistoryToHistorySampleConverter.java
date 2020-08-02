package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.History;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.HistorySample;
import lombok.AllArgsConstructor;

import java.util.Locale;
import java.util.Optional;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_EN;

@AllArgsConstructor
public abstract class HistoryToHistorySampleConverter<S extends History> implements Converter<S, HistorySample> {

    private final ConversionService conversionService;

    @Override
    public HistorySample convert(S source) {
        HistorySample target = new HistorySample();
        target.setId(source.getId());
        target.setDescription(source.getDescription());
        target.setCreateDate(source.getCreateDate());
        target.setEmployee(convertEmployee(source.getEmployee()));
        return target;
    }

    @Override
    public HistorySample convertWithLocale(S source, Locale locale) {
        HistorySample target = convert(source);
        if (LANGUAGE_TAG_EN.equalsIgnoreCase(locale.getLanguage())) {
            Optional.ofNullable(source.getDescriptionEn()).ifPresent(target::setDescription);
        }

        return target;
    }

    private EmployeeSample convertEmployee(Employee employee) {
        return conversionService.convert(employee, EmployeeSample.class);
    }

    @Override
    public Class<HistorySample> getTarget() {
        return HistorySample.class;
    }
}
