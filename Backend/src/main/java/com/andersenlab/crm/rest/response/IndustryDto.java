package com.andersenlab.crm.rest.response;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class IndustryDto {
    @NotNull
    private Long id;
    private String name;
    private Boolean common;
}