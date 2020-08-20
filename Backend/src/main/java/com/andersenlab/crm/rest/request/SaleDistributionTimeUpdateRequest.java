package com.andersenlab.crm.rest.request;

import lombok.Data;

import java.time.LocalTime;

@Data
public class SaleDistributionTimeUpdateRequest {
    private LocalTime from;
    private LocalTime to;
}
