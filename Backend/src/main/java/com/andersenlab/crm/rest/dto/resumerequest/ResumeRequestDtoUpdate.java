package com.andersenlab.crm.rest.dto.resumerequest;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ResumeRequestDtoUpdate {

    private String name;
    private Long companyId;
    private Long responsibleId;
    private String status;
    private LocalDate deadLine;
    private String priority;
    private Long companySaleId;
}
