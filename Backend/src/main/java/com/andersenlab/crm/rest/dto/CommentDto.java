package com.andersenlab.crm.rest.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDto {

    private Long id;
    private String description;
    private EmployeeDto employee;
    private LocalDateTime created;
    private Boolean isEdited;
    private Long requestId;
}
