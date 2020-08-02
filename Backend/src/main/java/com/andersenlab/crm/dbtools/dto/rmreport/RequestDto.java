package com.andersenlab.crm.dbtools.dto.rmreport;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Getter
@RequiredArgsConstructor
public class RequestDto {
    private final String id;
    private final String url;
    private final String company;
    private final String name;
    private final String status;
    private final String priority;
    private final EmployeeDto responsible;
    private final ResumeDto resume;
    private final List<ResumeDto> resumes;
}
