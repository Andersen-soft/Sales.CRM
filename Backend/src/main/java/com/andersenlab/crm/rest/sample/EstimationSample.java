package com.andersenlab.crm.rest.sample;

import lombok.Data;

@Data
public class EstimationSample {
    private String estimator;
    private String workType;
    private String status;
    private Boolean isActive;
}
