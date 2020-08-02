package com.andersenlab.crm.rest.sample;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanySaleSample {
    private Long id;
    private CompanySample company;
    private String description;
    private Boolean isActive;
    private String status;
    private LocalDateTime createDate;
    private LocalDateTime nextActivityDate;
    private String refinement;
}
