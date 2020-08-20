package com.andersenlab.crm.rest.dto.resumerequest;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResumeRequestUpdateNameOrDeadlineDto {
    private Long id;
    private String oldName;
    private String name;
    private LocalDateTime oldDeadline;
    private LocalDateTime deadline;
}
