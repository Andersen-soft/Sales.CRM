package com.andersenlab.crm.dbtools.dto.rmreport;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Objects;

@Getter
@RequiredArgsConstructor
public class EmployeeDto {
    private final String name;
    private final String login;
    private final String email;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        EmployeeDto employee = (EmployeeDto) o;
        return login.equals(employee.login) &&
                email.equals(employee.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(login, email);
    }
}
