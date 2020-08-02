package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleReportEmployeeResponse {
    private Long id;
    private String name;
}
