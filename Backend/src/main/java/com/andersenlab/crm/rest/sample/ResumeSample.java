package com.andersenlab.crm.rest.sample;

import lombok.Data;

@Data
public class ResumeSample {
    private Long id;
    private String fio;
    private Boolean isActive;
    private String status;
    private String responsibleHr;
}
