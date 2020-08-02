package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.request.EmployeeCreateRequest;
import com.andersenlab.crm.services.EmployeeService;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class EmployeeCreateRequestToEmployeeConverterTest {
    private static final Long TEST_EMPLOYEE_ID = 1L;
    private EmployeeCreateRequestToEmployeeConverter converter;

    @Before
    public void init() {
        EmployeeService employeeService = mock(EmployeeService.class);
        when(employeeService.getEmployeeByIdOrThrowException(any(Long.class)))
                .thenReturn(new Employee(TEST_EMPLOYEE_ID));
        converter = new EmployeeCreateRequestToEmployeeConverter(employeeService);
    }

    @Test
    public void testConvert() {
        EmployeeCreateRequest source = new EmployeeCreateRequest();
        source.setAdditionalInfo("employee test additional info");
        source.setEmail("employee test email");
        source.setLogin("employee test login");
        source.setFirstName("employee test firstName");
        source.setPosition("employee test position");
        source.setLastName("employee test lastName");
        source.setSkype("employee test skype");
        source.setEmployeeLang("employee test lang");
        source.setMentorId(TEST_EMPLOYEE_ID);

        Employee result = converter.convert(source);

        assertEquals(source.getLogin(), result.getLogin());
        assertEquals(source.getAdditionalInfo(), result.getAdditionalInfo());
        assertEquals(source.getEmail(), result.getEmail());
        assertEquals(source.getSkype(), result.getSkype());
        assertEquals(source.getEmployeeLang(), result.getEmployeeLang());
        assertEquals(source.getFirstName(), result.getFirstName());
        assertEquals(source.getLastName(), result.getLastName());
        assertEquals(source.getPosition(), result.getPosition());
        assertEquals(source.getMentorId(), result.getMentor().getId());
    }

    @Test
    public void testGetTarget() {
        Class<Employee> expectedResult = Employee.class;

        Class<Employee> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetSource() {
        Class<EmployeeCreateRequest> expectedResult = EmployeeCreateRequest.class;

        Class<EmployeeCreateRequest> result = converter.getSource();

        assertEquals(expectedResult, result);
    }
}