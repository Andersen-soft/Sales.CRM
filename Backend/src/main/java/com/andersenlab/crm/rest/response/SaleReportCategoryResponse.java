package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleReportCategoryResponse {
    private int categoryOrdinal;
    private String category;
    private String categoryEnumCode;
}
