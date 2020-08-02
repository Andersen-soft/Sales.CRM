package com.andersenlab.crm.converter;

import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.google.common.collect.ImmutableSet;

import java.time.LocalDateTime;

abstract class EmployeeConverterTest {

    private static final String TEST_LOGIN = "test login";
    private static final String TEST_ADDITIONAL_INFORMATION = "test additional information";
    private static final String TEST_ADDITIONAL_PHONE_NUMBER = "test additional phone number";
    private static final String TEST_EMAIL_ADDRESS = "test email address";
    private static final String TEST_NAME = "test name";
    private static final String PHONE = "phone";
    private static final String LAST = "last";
    private static final String SKYPE = "skype";
    private static final String EMPLOYEE_LANG = "lang";

    Employee createEmployee() {
        LocalDateTime localDateTime = LocalDateTime.of(2018, 9, 9, 10, 10, 10);
        Employee employee = new Employee();
        employee.setId(1L);
        Role role = new Role();
        role.setName(RoleEnum.ROLE_ADMIN);
        employee.setIsActive(true);
        employee.setLastAccessDate(localDateTime);
        employee.setLogin(TEST_LOGIN);
        employee.setAdditionalInfo(TEST_ADDITIONAL_INFORMATION);
        employee.setAdditionalPhone(TEST_ADDITIONAL_PHONE_NUMBER);
        employee.setEmail(TEST_EMAIL_ADDRESS);
        employee.setFirstName(TEST_NAME);
        employee.setPhone(PHONE);
        employee.setLastName(LAST);
        employee.setSkype(SKYPE);
        employee.setEmployeeLang(EMPLOYEE_LANG);
        employee.setCreateDate(localDateTime);
        employee.setId(employee.getId());
        employee.setRoles(ImmutableSet.of(role));
        employee.setResponsibleRM(false);

        return employee;
    }
}
