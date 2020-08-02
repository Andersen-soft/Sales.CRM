package com.andersenlab.crm.rest.response;

import com.andersenlab.crm.rest.dto.file.FileDto;
import com.andersenlab.crm.rest.sample.EmployeeSample;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResumeResponse {
    private Long id;
    private String fio;
    private String status;
    private Boolean isActive;
    private EmployeeSample responsibleEmployee;
    private List<FileDto> files;
    @JsonProperty("comment")
    private String hrComment;
    private Boolean isUrgent;
    private LocalDateTime deadline;
    private LocalDateTime dateCreated;
    private Long requestId;
    private String requestName;
}
