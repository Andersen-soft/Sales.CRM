package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleReportTypeResponse {
    private int reportTypeOrdinal;
    private String reportTypeEnumCode;
    private String reportType;
}
