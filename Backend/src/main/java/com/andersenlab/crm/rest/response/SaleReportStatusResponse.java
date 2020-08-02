package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleReportStatusResponse {
    private int statusOrdinal;
    private String status;
    private String statusEnumCode;
}
