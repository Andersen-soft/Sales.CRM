package com.andersenlab.crm.rest.response;

import lombok.Data;

import java.time.LocalTime;

@Data
public class SaleDistributionTimeResponse {
    private LocalTime from;
    private LocalTime to;
}
