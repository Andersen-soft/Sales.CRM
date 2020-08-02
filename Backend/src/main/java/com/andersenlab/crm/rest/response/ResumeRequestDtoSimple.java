package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.dto.EmployeeDto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResumeRequestDtoSimple {

    private Long id;
    private String name;
    private EmployeeDto responsible;
    private String status;
    private LocalDateTime created;

}
