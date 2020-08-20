package com.andersenlab.crm.rest.dto;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.Accessors;

/**
 * ChangePassDto dto between server and front change password form.
 *
 * @author Roman_Haida
 * 19.07.2019
 */
@Data
@Accessors(chain = true)
public class ChangePassDto {

    private String login;

    @JsonInclude(NON_EMPTY)
    private String pass;

    /**
     * Access token is generated temporary to change password.
     */
    @JsonInclude(NON_EMPTY)
    private String token;

    /**
     * External ID of temporal access token.
     */
    @JsonInclude(NON_EMPTY)
    private String tokenKey;
}
