package com.andersenlab.crm.rest.request;

import lombok.Data;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Data
public class CompanySaleCreateRequest {
    @NotNull
    private Long sourceId;

    private Long recommendationId;

    @NotNull
    @Valid
    private CompanyCreateRequest company;
}
