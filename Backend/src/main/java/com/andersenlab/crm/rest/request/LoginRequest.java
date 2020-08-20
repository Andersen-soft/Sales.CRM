package com.andersenlab.crm.rest.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private String submit;
}
