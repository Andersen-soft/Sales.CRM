package com.andersenlab.crm.rest.dto.resumerequest;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@RequiredArgsConstructor
public class ResumeRequestSkypeDto {
    private final Long id;
    private final String company;
    private final String name;
    private final String status;
    private final String responsible;
    private final String priority;
    private final LocalDateTime statusChangedDate;
    private final Set<ResumeSkypeDto> resumes;
}
