package com.andersenlab.crm.converter.employee;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class EmployeeToEmployeeDto implements Converter<Employee, EmployeeDto> {

    @Override
    public EmployeeDto convert(Employee source) {
        EmployeeDto target = new EmployeeDto();
        Optional.ofNullable(source.getId()).ifPresent(target::setId);
        Optional.ofNullable(source.getFirstName()).ifPresent(target::setFirstName);
        Optional.ofNullable(source.getLastName()).ifPresent(target::setLastName);
        Optional.ofNullable(source.getResponsibleRM()).ifPresent(target::setResponsibleRM);
        return target;
    }

    @Override
    public Class<Employee> getSource() {
        return Employee.class;
    }

    @Override
    public Class<EmployeeDto> getTarget() {
        return EmployeeDto.class;
    }
}
