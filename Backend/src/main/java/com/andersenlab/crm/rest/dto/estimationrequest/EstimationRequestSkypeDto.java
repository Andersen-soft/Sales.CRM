package com.andersenlab.crm.rest.dto.estimationrequest;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Getter
@RequiredArgsConstructor
public class EstimationRequestSkypeDto {
    private final Long id;
    private final String companyName;
    private final String name;
    private final String status;
    private final String responsible;
    private final LocalDateTime statusChangedDate;
}
