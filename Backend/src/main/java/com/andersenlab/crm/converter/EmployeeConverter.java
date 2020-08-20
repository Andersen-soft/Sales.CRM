package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.SimpleConverter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.response.EmployeeDto;

import java.util.Optional;

public class EmployeeConverter extends SimpleConverter<EmployeeDto, Employee> {

    public EmployeeConverter() {
        super(EmployeeConverter::fromDto, EmployeeConverter::toDto);
    }

    private static Employee fromDto(EmployeeDto dto) {
        final Employee entity = new Employee();
        Optional.ofNullable(dto).ifPresent(o -> entity.setId(o.getId()));
        Optional.ofNullable(dto).ifPresent(o -> entity.setFirstName(o.getFirstName()));
        Optional.ofNullable(dto).ifPresent(o -> entity.setLastName(o.getLastName()));
        return entity;
    }

    private static EmployeeDto toDto(Employee entity) {
        final EmployeeDto dto = new EmployeeDto();
        Optional.ofNullable(entity).ifPresent(o -> dto.setId(o.getId()));
        Optional.ofNullable(entity).ifPresent(o -> dto.setFirstName(o.getFirstName()));
        Optional.ofNullable(entity).ifPresent(o -> dto.setLastName(o.getLastName()));
        return dto;
    }
}
