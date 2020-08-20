package com.andersenlab.crm.rest.dto.file;

import com.andersenlab.crm.rest.dto.EmployeeDto;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonPropertyOrder({"id", "name", "link", "employee", "addedDate"})
public class FileDto {

    private Long id;
    private String name;
    private EmployeeDto employee;
    private LocalDateTime addedDate;

}
