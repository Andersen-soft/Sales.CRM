package com.andersenlab.crm.rest.response;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class CompanySocialAnswerDto {
    private Long id;
    @NotBlank
    private String name;
    private String phone;
    private String site;
}
