package com.andersenlab.crm.dbtools.dto.rmreport;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class ResumeDto {
    private final Long id;
    private final String fio;
    private final String status;
}
