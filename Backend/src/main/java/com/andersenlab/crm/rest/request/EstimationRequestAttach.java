package com.andersenlab.crm.rest.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class EstimationRequestAttach {
    @NotNull
    private Long companySaleId;
}
