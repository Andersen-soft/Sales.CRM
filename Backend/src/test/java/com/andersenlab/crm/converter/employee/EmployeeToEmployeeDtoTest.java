package com.andersenlab.crm.converter.employee;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.dto.EmployeeDto;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class EmployeeToEmployeeDtoTest {

    private EmployeeToEmployeeDto converter;
    private Employee employee;

    @Before
    public void setUp() {
        converter = new EmployeeToEmployeeDto();
        employee = getEmployee();
    }

    @Test
    public void whenGetClassesThenReturnExpected() {
        assertEquals(converter.getSource(), Employee.class);
        assertEquals(converter.getTarget(), EmployeeDto.class);
    }

    @Test
    public void convert() {
        EmployeeDto result = converter.convert(employee);
        assertNotNull(result);
        assertEquals("Company id", employee.getId(), result.getId());
        assertEquals("Company name", employee.getFirstName(), result.getFirstName());
        assertEquals("Company name", employee.getLastName(), result.getLastName());
    }

    private Employee getEmployee() {
        Employee theEmployee = new Employee(22L);
        theEmployee.setFirstName("Тестовое имя");
        theEmployee.setLastName("Тестовая фамилия");
        return theEmployee;
    }
}
