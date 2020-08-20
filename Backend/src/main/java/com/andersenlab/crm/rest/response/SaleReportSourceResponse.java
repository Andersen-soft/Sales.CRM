package com.andersenlab.crm.rest.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleReportSourceResponse {
    private Long sourceId;
    private String sourceName;

    @JsonProperty("tooltip")
    private String description;
}
