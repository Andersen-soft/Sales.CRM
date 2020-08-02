package com.andersenlab.crm.rest.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class SocialNetworkUserDto {

    @NonNull
    private Long id;

    @NotBlank
    private String name;

}
