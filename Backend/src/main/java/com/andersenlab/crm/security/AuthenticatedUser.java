package com.andersenlab.crm.security;

import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.EmployeeRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

import static com.andersenlab.crm.exceptions.ExceptionMessages.EMPLOYEE_NOT_FOUND_MESSAGE;

@Component
@AllArgsConstructor
public class AuthenticatedUser {

    private final EmployeeRepository employeeRepository;

    public String getLoggedInUserLogin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && !(authentication instanceof AnonymousAuthenticationToken) ? authentication.getName() : null;
    }

    public Employee getCurrentEmployee() {
        String loggedInUserLogin = getLoggedInUserLogin();
        if(loggedInUserLogin != null) {
            return Optional.ofNullable(employeeRepository.findEmployeeByLogin(loggedInUserLogin))
                    .orElseThrow(() -> new ResourceNotFoundException(EMPLOYEE_NOT_FOUND_MESSAGE));
        }
        return null;
    }
}
