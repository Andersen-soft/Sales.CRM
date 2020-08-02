package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class EmployeeToEmployeeSampleConverterTest extends EmployeeConverterTest {

    private EmployeeToEmployeeSampleConverter converter = new EmployeeToEmployeeSampleConverter();

    @Test
    public void testConvert() {
        Employee source = createEmployee();

        EmployeeSample result = converter.convert(source);

        assertEquals(source.getAdditionalInfo(), result.getAdditionalInfo());
        assertEquals(source.getAdditionalPhone(), result.getAdditionalPhone());
        assertEquals(source.getEmail(), result.getEmail());
        assertEquals(source.getFirstName(), result.getFirstName());
        assertEquals(source.getLastName(), result.getLastName());
        assertEquals(source.getId(), result.getId());
        assertEquals(source.getPhone(), result.getPhone());
        assertEquals(source.getSkype(), result.getSkype());
    }

    @Test
    public void testGetTarget() {
        Class<EmployeeSample> expectedResult = EmployeeSample.class;

        Class<EmployeeSample> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetSource() {
        Class<Employee> expectedResult = Employee.class;

        Class<Employee> result = converter.getSource();

        assertEquals(expectedResult, result);
    }
}