package com.andersenlab.crm.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstimationRequestOldDto implements Dto {

    private Long id;

    @NotNull
    private String name;

    private Long oldId;

    @NotNull
    private Long companyId;
}
