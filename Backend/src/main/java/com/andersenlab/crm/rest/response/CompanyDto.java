package com.andersenlab.crm.rest.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class CompanyDto {
    @NonNull
    private Long id;
    @NotNull
    private String name;
}
