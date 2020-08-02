package com.andersenlab.crm.rest.request;

import lombok.Data;

@Data
public class RefreshTokenRequest {
    private String token;
}
