package com.andersenlab.crm.rest.sample;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Objects;

@Data
@Accessors(chain = true)
public class EmployeeSample {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String skype;
    private String phone;
    private String additionalPhone;
    private String additionalInfo;

    @Override
    public String toString() {
        return String.format("%s %s", Objects.toString(firstName, ""), Objects.toString(lastName, "")).trim();
    }
}
