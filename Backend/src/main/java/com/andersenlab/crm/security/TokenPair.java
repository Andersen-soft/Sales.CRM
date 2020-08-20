package com.andersenlab.crm.security;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
class TokenPair {
    private String refreshToken;
    private String accessToken;
}
