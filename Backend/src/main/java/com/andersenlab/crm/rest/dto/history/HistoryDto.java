package com.andersenlab.crm.rest.dto.history;

import com.andersenlab.crm.rest.dto.EmployeeDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HistoryDto {

    private Long id;
    private String description;
    private EmployeeDto employee;
    private LocalDateTime date;

}
