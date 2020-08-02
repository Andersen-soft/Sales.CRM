package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.Converter;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import org.springframework.stereotype.Component;

@Component
public class EmployeeToEmployeeSampleConverter implements Converter<Employee, EmployeeSample> {

    @Override
    public Class<Employee> getSource() {
        return Employee.class;
    }

    @Override
    public Class<EmployeeSample> getTarget() {
        return EmployeeSample.class;
    }

    @Override
    public EmployeeSample convert(Employee source) {
        EmployeeSample target = new EmployeeSample();
        target.setAdditionalInfo(source.getAdditionalInfo());
        target.setAdditionalPhone(source.getAdditionalPhone());
        target.setEmail(source.getEmail());
        target.setId(source.getId());
        target.setFirstName(source.getFirstName());
        target.setPhone(source.getPhone());
        target.setLastName(source.getLastName());
        target.setSkype(source.getSkype());
        return target;
    }
}
