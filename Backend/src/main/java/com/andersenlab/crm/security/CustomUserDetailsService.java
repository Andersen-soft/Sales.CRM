package com.andersenlab.crm.security;

import com.andersenlab.crm.exceptions.CrmAuthException;
import com.andersenlab.crm.model.RoleEnum;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.model.entities.Role;
import com.andersenlab.crm.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomUserDetailsService implements UserDetailsService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public CustomUserDetailsService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) {
        Employee employee = employeeRepository.findEmployeeByLogin(login);
        if (employee == null) {
            throw new UsernameNotFoundException(
                    "No responsible found with username: " + login);
        }
        boolean enabled = employee.getIsActive();

        List<SimpleGrantedAuthority> authorities;
        if (!employee.getRoles().isEmpty()) {
            authorities = employee.getRoles()
                    .stream()
                    .map(Role::getName)
                    .map(RoleEnum::toString)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        } else {
            throw new CrmAuthException("Employee must have a role for login");
        }
        return new User(
                employee.getLogin(),
                employee.getPassword(),
                enabled,
                true,
                true,
                true,
                authorities);

    }
}
