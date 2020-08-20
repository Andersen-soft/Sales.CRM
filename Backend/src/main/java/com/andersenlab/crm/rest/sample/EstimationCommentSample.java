package com.andersenlab.crm.rest.sample;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EstimationCommentSample {

    private Long id;
    private String commentBody;
    private LocalDateTime createDate;
    private EmployeeSample employee;
}
