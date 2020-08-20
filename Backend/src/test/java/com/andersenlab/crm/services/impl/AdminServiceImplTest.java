package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.configuration.CrmLdapHelper;
import com.andersenlab.crm.configuration.properties.ApplicationProperties;
import com.andersenlab.crm.convertservice.ConversionService;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.LdapUser;
import com.andersenlab.crm.model.Message;
import com.andersenlab.crm.model.RecipientDto;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.RoleRepository;
import com.andersenlab.crm.rest.dto.ChangePassDto;
import com.andersenlab.crm.security.TokenManager;
import com.andersenlab.crm.services.CountryService;
import com.andersenlab.crm.services.EmployeeService;
import com.andersenlab.crm.services.MailService;
import com.andersenlab.crm.services.PasswordGenerateService;
import com.andersenlab.crm.services.TokenService;
import com.google.common.collect.ImmutableList;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.UUID;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

public class AdminServiceImplTest {

    private final EmployeeService employeeService = mock(EmployeeService.class);
    private final CrmLdapHelper crmLdapHelper = mock(CrmLdapHelper.class);
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final MailService mailService = mock(MailService.class);
    private final RoleRepository roleRepository = mock(RoleRepository.class);
    private final ConversionService conversionService = mock(ConversionService.class);
    private final TokenManager tokenManager = mock(TokenManager.class);
    private final TokenService tokenService = mock(TokenService.class);
    private final CountryService countryService = mock(CountryService.class);
    private final PasswordGenerateService passwordGenerateService = mock(PasswordGenerateService.class);
    private final ApplicationProperties applicationProperties = mock(ApplicationProperties.class);
    private final AdminServiceImpl adminService = new AdminServiceImpl(
            employeeService,
            crmLdapHelper,
            passwordEncoder,
            mailService,
            roleRepository,
            countryService,
            conversionService,
            tokenManager,
            tokenService,
            passwordGenerateService,
            applicationProperties
    );

    private ArgumentCaptor<Message> messageArgumentCaptor = ArgumentCaptor.forClass(Message.class);

    @Test
    public void whenRegisterInCrmAndOk() {
        Employee employee = new Employee();

        employeeService.createEmployee(employee);
        verify(employeeService, times(1)).createEmployee(employee);
    }

    @Test
    public void whenGetPageableLdapUsersAndReturnExpectedResponse() {
        LdapUser user = new LdapUser();
        String name = "name";
        String email = "example@email.com";
        user.setName(name);
        user.setEmail(email);

        when(crmLdapHelper.getAllUsers()).thenReturn(ImmutableList.of(user));
        ImmutableList<LdapUser> users = crmLdapHelper.getAllUsers();

        Page<LdapUser> userPage = new PageImpl<>(users);
        Pageable pageable = new PageRequest(userPage.getNumber(), 1);

        adminService.getPageableLdapUsers(name, email, false, pageable);
        assertEquals(1, pageable.getPageSize());
    }

    @Test
    public void whenGetPageableLdapUsersAndReturnSortedList() {
        LdapUser user = new LdapUser();
        String name = "name";
        String email = "example@email.com";
        user.setName(name);
        user.setEmail(email);
        LdapUser user1 = new LdapUser();
        String name1 = "1name";
        String email1 = "1example@email.com";
        user1.setName(name1);
        user1.setEmail(email1);
        LdapUser user2 = new LdapUser();
        String name2 = "2name";
        String email2 = "2example@email.com";
        user2.setName(name2);
        user2.setEmail(email2);

        ImmutableList<LdapUser> userList = ImmutableList.of(user, user1, user2);

        given(crmLdapHelper.getAllUsers()).willReturn(userList);

        Page<LdapUser> userPage = new PageImpl<>(userList);
        Pageable pageable = new PageRequest(userPage.getNumber(), 3, new Sort(new Sort.Order(Sort.Direction.DESC, "name")));

        Page<LdapUser> pageableLdapUsers = adminService.getPageableLdapUsers(name, email, false, pageable);
        assertEquals(3, pageable.getPageSize());
        assertEquals(3, userPage.getTotalElements());
        assertNotEquals(userList, pageableLdapUsers.getContent());
    }

    @Test
    public void whenResetPasswordThenSuccess() {
        Employee employee = getEmployee(false);

        doNothing().when(mailService).sendMail(any(RecipientDto.class), any(Message.class));
        when(employeeService.getEmployeeByIdOrThrowException(23L)).thenReturn(employee);

        String answer = adminService.resetPassword(23L);

        assertTrue(answer.contains("Ссылка для изменения пароля отправлена"));
        verify(mailService).sendMail(any(RecipientDto.class), messageArgumentCaptor.capture());
        assertTrue(((String) (messageArgumentCaptor.getValue().getArgs().get("url"))).contains("/login?k="));
        assertEquals(Message.Template.EMPLOYEE_PASSWORD_RESET, messageArgumentCaptor.getValue().getTemplate());
    }

    @Test(expected = CrmException.class)
    public void whenResetPasswordForLdapUserThenFailed() {
        Employee employee = getEmployee(true);

        doNothing().when(mailService).sendMail(any(RecipientDto.class), any(Message.class));
        when(employeeService.getEmployeeByIdOrThrowException(23L)).thenReturn(employee);

        adminService.resetPassword(23L);
    }

    @Test
    public void whenChangePasswordThenSuccess() {
        Employee employee = getEmployee(false);
        String tokenKey = UUID.randomUUID().toString();
        ChangePassDto dto = new ChangePassDto()
                .setLogin(employee.getLogin())
                .setTokenKey(tokenKey)
                .setPass("newPass");
        when(employeeService.findByLogin(anyString())).thenReturn(employee);

        adminService.changePassword(dto);

        assertTrue(passwordEncoder.matches(dto.getPass(), employee.getPassword()));
    }

    @Test(expected = CrmException.class)
    public void whenChangePasswordForLdapUserThenFailed() {
        Employee employee = getEmployee(true);
        String tokenKey = UUID.randomUUID().toString();
        ChangePassDto dto = new ChangePassDto()
                .setLogin(employee.getLogin())
                .setTokenKey(tokenKey)
                .setPass("newPass");
        when(employeeService.findByLogin(anyString())).thenReturn(employee);

        adminService.changePassword(dto);
    }

    private Employee getEmployee(boolean isLdapUser) {
        Employee employee = new Employee();
        employee.setId(23L);
        employee.setFirstName("John");
        employee.setLastName("Dou");
        employee.setMayDBAuth(!isLdapUser);
        employee.setEmail("test@test.com");
        employee.setIsActive(true);
        employee.setLogin("testUser");
        employee.setPassword("testPass");
        return employee;
    }
}
