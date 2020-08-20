package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.repositories.ReportRepository;
import com.andersenlab.crm.repositories.RoleRepository;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.services.RoleService;
import org.junit.Before;
import org.junit.Test;

import static com.andersenlab.crm.model.RoleEnum.ROLE_ADMIN;
import static com.andersenlab.crm.model.RoleEnum.ROLE_SALES;
import static org.junit.Assert.assertSame;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class EmployeeServiceImplTest {
    private static final RoleEnum ADMIN_ROLE = ROLE_ADMIN;
    private static final RoleEnum SALE_ROLE = ROLE_SALES;
    private static final String NAME_1 = "1";
    private static final Long ID = 1L;
    private EmployeeRepository employeeRepository;
    private ReportRepository reportRepository;
    private RoleRepository roleRepository;
    private RoleService roleService;
    private EmployeeServiceImpl employeeService;
    private MailService mailService;
    private CountryService countryService;


    @Before
    public void setup() {
        roleRepository = mock(RoleRepository.class);
        employeeRepository = mock(EmployeeRepository.class);
        employeeService = new EmployeeServiceImpl(
                employeeRepository,
                reportRepository,
                roleRepository,
                roleService,
                mailService,
                countryService
        );
    }

    @Test
    public void whenCreateEmployeeThenRepositorySaveInvokes() {
        Employee employee = new Employee();
        Role role = new Role();
        role.setName(SALE_ROLE);

        given(employeeRepository.findEmployeeByLogin("login")).willReturn(employee);
        given(roleRepository.findRoleByName(SALE_ROLE)).willReturn(role);

        employeeService.saveEmployee(employee);

        verify(employeeRepository, times(1)).saveAndFlush(employee);
    }

    @Test
    public void whenGetEmployeeByLoginThenReturnExpectedEmployee() {
        Employee employee = new Employee();
        given(employeeRepository.findOne(ID)).willReturn(employee);

        Employee found = employeeService.getEmployeeByIdOrThrowException(ID);

        assertSame(employee, found);
        verify(employeeRepository, times(1)).findOne(ID);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void whenGetEmployeeByLoginAndNotFoundThenExpectedResourceNotFound() {
        when(employeeRepository.findEmployeeByLogin(NAME_1)).thenReturn(null);

        employeeService.getEmployeeByIdOrThrowException(1L);

        verify(employeeRepository, times(1)).findEmployeeByLogin(NAME_1);
    }
}