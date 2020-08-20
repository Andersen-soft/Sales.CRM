package com.andersenlab.crm.rest.dto.resumerequest;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
public class ResumeSkypeDto {
    private final Long id;
    private final String fio;
    private final String status;
    private final String responsible;
    private final LocalDateTime statusChangedDate;
}
