package com.andersenlab.crm.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.Objects;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class EmployeeDto {

    @NonNull
    private Long id;

    private String firstName;

    private String lastName;

    private boolean responsibleRM;

    @Override
    public String toString(){
        return String.format("%s %s", Objects.toString(firstName, ""), Objects.toString(lastName, "")).trim();
    }
}
