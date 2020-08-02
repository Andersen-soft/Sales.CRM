package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.sample.EmployeeSample;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String description;
    private EmployeeSample employee;
    private LocalDateTime createDate;
    private LocalDateTime editDate;
    private Boolean isEdited;
    private Long requestId;
}
