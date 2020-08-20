package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleReportCountryResponse {
    private Long countryId;
    private String countryName;
}
