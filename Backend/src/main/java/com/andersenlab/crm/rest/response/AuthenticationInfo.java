package com.andersenlab.crm.rest.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AuthenticationInfo {
    private final String username;
    private final String[] roles;
    private final Long id;
    private final String employeeLang;
}
