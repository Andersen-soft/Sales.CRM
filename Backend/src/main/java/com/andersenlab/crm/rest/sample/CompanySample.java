package com.andersenlab.crm.rest.sample;

import lombok.Data;

@Data
public class CompanySample {

    private long id;
    private String name;
    private String url;
    private String description;
    private Boolean isActive;
    private EmployeeSample responsible;
}
