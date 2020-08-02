package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.SaleRequest;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.andersenlab.crm.rest.sample.SaleRequestSample;
import lombok.AllArgsConstructor;

import java.util.Optional;

@AllArgsConstructor
public abstract class SaleRequestToSaleRequestSampleConverter<T extends SaleRequest> implements Converter<T, SaleRequestSample> {

    private final ConversionService conversionService;

    void setGenericFields(SaleRequest source, SaleRequestSample target) {
        target.setIsFavorite(source.getIsFavorite());
        Optional.ofNullable(source.getDeadline()).ifPresent(date -> target.setDeadline(date.toLocalDate()));
        target.setId(source.getId());
        target.setIsActive(source.getIsActive());
        Optional.ofNullable(source.getResponsibleRM()).
                ifPresent(employee -> target.setResponsibleRm(convertEmployee(employee)));
    }

    private EmployeeSample convertEmployee(Employee employee) {
        return conversionService.convert(employee, EmployeeSample.class);
    }

    @Override
    public Class<SaleRequestSample> getTarget() {
        return SaleRequestSample.class;
    }
}
