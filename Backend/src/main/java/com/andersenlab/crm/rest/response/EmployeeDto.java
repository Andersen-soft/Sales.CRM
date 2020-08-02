package com.andersenlab.crm.rest.response;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.Objects;

@Data
public class EmployeeDto {
    @NotNull
    private Long id;
    private String firstName;
    private String lastName;

    private Boolean responsibleRm;

    @Override
    public String toString() {
        return String.format("%s %s", Objects.toString(firstName, ""), Objects.toString(lastName, "")).trim();
    }
}
