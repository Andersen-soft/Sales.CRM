package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.dto.EmployeePublicResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmployeeToEmployeePublicResponseConverter implements Converter<Employee, EmployeePublicResponse> {
    @Override
    public Class<Employee> getSource() {
        return Employee.class;
    }

    @Override
    public Class<EmployeePublicResponse> getTarget() {
        return EmployeePublicResponse.class;
    }

    @Override
    public EmployeePublicResponse convert(Employee source) {
        EmployeePublicResponse target = new EmployeePublicResponse();
        target.setId(source.getId());
        target.setName(source.getFirstName() + " " + source.getLastName());
        return target;
    }
}
