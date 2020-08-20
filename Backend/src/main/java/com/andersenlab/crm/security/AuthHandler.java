package com.andersenlab.crm.security;

import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.andersenlab.crm.configuration.CrmLdapHelper;
import com.andersenlab.crm.configuration.properties.LdapProperties;
import com.andersenlab.crm.exceptions.CrmAuthException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.rest.request.LoginRequest;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@AllArgsConstructor
public class AuthHandler {

    private final CrmLdapHelper crmLdapHelper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;
    private final LdapProperties ldapProperties;

    private static final String WRONG_CREDENTIALS = "Неверный логин или пароль. Пожалуйста, проверьте внесенные данные.";

    Authentication authorize(String login) {
        Employee employee = employeeRepository.findEmployeeByLogin(login);
        Authentication authentication = getAuthentication(employee);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return authentication;
    }

    /**
     * Verifies user authorities when connects websocket.
     *
     * @param login current user login
     * @return authenticated principal
     */
    public Authentication getWSPrincipal(String login) {
        Employee employee = employeeRepository.findEmployeeByLogin(login);
        return getAuthentication(employee);
    }

    Authentication authenticate(LoginRequest loginRequest) {
        Employee employee = getEmployee(loginRequest.getUsername());
        return Boolean.TRUE.equals(employee.getMayDBAuth())
                ? localAuth(loginRequest, employee)
                : ldapAuth(loginRequest, employee);
    }

    private Authentication ldapAuth(LoginRequest loginRequest, Employee employee) {
        if (tryLdapAuth(loginRequest)) {
            setEmployeePassword(loginRequest.getPassword(), employee);
            return getAuthentication(employee);
        }

        throw new BadCredentialsException(WRONG_CREDENTIALS);
    }

    private Authentication localAuth(LoginRequest loginRequest, Employee employee) {
        if (isEmpty(employee.getPassword()) && tryLdapAuth(loginRequest)) {
            setEmployeePassword(loginRequest.getPassword(), employee);
        }

        if (bCryptPasswordEncoder.matches(loginRequest.getPassword(), employee.getPassword())) {
            return getAuthentication(employee);
        }

        throw new BadCredentialsException(WRONG_CREDENTIALS);
    }

    private boolean tryLdapAuth(LoginRequest loginRequest) {
        String login = ldapProperties.getNtNamePrefix() + loginRequest.getUsername();
        String password = loginRequest.getPassword();
        return crmLdapHelper.tryConnectWithCredentials(login, password);
    }

    private Authentication getAuthentication(Employee employee) {
        final Employee authenticationCandidate = Optional.ofNullable(employee.getMentor()).orElse(employee);
        Authentication authenticate = authenticationManager.authenticate(constructAuthentication(authenticationCandidate, getRoles(authenticationCandidate)));
        authenticationCandidate.setLastAccessDate(LocalDateTime.now());
        employeeRepository.save(authenticationCandidate);
        return authenticate;
    }

    private UsernamePasswordAuthenticationToken constructAuthentication(Employee employee, List<String> roles) {
        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                employee.getLogin(),
                employee.getPassword(),
                authorities);
        authentication.setDetails(new Object[]{employee.getId(), employee.getEmployeeLang()});
        return authentication;
    }

    private Employee getEmployee(String login) {
        return Optional.ofNullable(employeeRepository.findEmployeeByLogin(login))
                .orElseThrow(() -> new AuthenticationCredentialsNotFoundException(WRONG_CREDENTIALS));
    }

    private void setEmployeePassword(String password, Employee employee) {
        employee.setPassword(bCryptPasswordEncoder.encode(password));
        employeeRepository.saveAndFlush(employee);
    }

    private List<String> getRoles(Employee employee) {
        if (!employee.getRoles().isEmpty()) {
            return employee.getRoles()
                    .stream()
                    .map(Role::getName)
                    .map(RoleEnum::toString)
                    .collect(Collectors.toList());
        } else {
            throw new CrmAuthException("Employee must have a role for login");
        }
    }
}
