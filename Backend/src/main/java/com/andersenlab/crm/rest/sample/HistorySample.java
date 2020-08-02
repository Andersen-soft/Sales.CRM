package com.andersenlab.crm.rest.sample;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HistorySample {

    private Long id;
    private LocalDateTime createDate;
    private String description;
    private EmployeeSample employee;
}
