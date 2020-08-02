package com.andersenlab.crm.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimerNotifierDto {
    private Long employeeId;
    private Long companySaleId;
}
