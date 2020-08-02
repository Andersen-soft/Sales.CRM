package com.andersenlab.crm.converter;

import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.ActivityRepository;
import com.andersenlab.crm.rest.response.EmployeeResponse;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class EmployeeToEmployeeResponseConverterTest extends EmployeeConverterTest {

    private ActivityRepository activityRepository;
    private EmployeeToEmployeeResponseConverter converter;

    @Before
    public void init() {
        activityRepository = Mockito.mock(ActivityRepository.class);
        ConversionService conversionService = mock(ConversionService.class);
        converter = new EmployeeToEmployeeResponseConverter(conversionService, activityRepository);
    }

    @Test
    public void testConvert() {
        Employee source = createEmployee();
        when(activityRepository.existsActivityByResponsibleId(Mockito.anyLong())).thenReturn(true);

        EmployeeResponse result = converter.convert(source);

        assertEquals(source.getLogin(), result.getLogin());
        assertEquals(source.getAdditionalInfo(), result.getAdditionalInfo());
        assertEquals(source.getEmail(), result.getEmail());
        assertEquals(source.getFirstName(), result.getFirstName());
        assertEquals(source.getLastName(), result.getLastName());
        assertEquals(source.getId(), result.getId());
        assertEquals(source.getIsActive(), result.getIsActive());
        assertEquals(source.getPhone(), result.getPhone());
        assertEquals(source.getSkype(), result.getSkype());
        assertEquals(source.getEmployeeLang(), result.getEmployeeLang());
        assertEquals(source.getResponsibleRM(), result.isResponsibleRM());
    }

    @Test
    public void testGetTarget() {
        Class<EmployeeResponse> expectedResult = EmployeeResponse.class;

        Class<EmployeeResponse> result = converter.getTarget();

        assertEquals(expectedResult, result);
    }

    @Test
    public void testGetSource() {
        Class<Employee> expectedResult = Employee.class;

        Class<Employee> result = converter.getSource();

        assertEquals(expectedResult, result);
    }
}