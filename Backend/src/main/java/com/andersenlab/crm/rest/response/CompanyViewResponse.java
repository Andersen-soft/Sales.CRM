package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CompanyViewResponse {
    private Long id;
    private String name;
    private Boolean isFavorite;
    private Boolean isActive;
    private LocalDateTime nextActivityDate;
    private EmployeeSample responsible;
}
