package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleReportCompanyRecommendationResponse {
    private Long id;
    private String name;
}
