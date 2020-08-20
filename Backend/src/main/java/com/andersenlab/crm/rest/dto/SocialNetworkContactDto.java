package com.andersenlab.crm.rest.dto;

import com.andersenlab.crm.rest.response.SourceDto;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class SocialNetworkContactDto {

    private Long id;

    @NotNull
    private SocialNetworkUserDto socialNetworkUser;

    @NotNull
    private SourceDto source;

    @NotNull
    private EmployeeDto sales;

    @NotNull
    private EmployeeDto salesAssistant;

}
