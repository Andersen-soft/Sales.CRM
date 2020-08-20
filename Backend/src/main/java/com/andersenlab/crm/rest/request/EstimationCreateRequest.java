package com.andersenlab.crm.rest.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * Represents request for creating new estimation
 *
 * @author Yevhenii Muzyka on 03.08.2018
 */
@Data
public class EstimationCreateRequest {

    @NotNull
    private Long idEstimationRequest;

    @NotNull
    private String estimator;

    @NotNull
    private String workType;
}
