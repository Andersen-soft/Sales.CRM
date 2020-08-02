package com.andersenlab.crm.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DayDistributionEmployeeDto {
    private long companySaleId;
    private long employeeId;
    private String companyName;
}