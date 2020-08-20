package com.andersenlab.crm.rest.sample;

import com.andersenlab.crm.rest.response.ContactResponse;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ActivitySample {
    private LocalDateTime dateActivity;
    private String type;
    private String subject;
    private String result;
    private String description;
    private ContactResponse contact;
    private EmployeeSample employee;
}
