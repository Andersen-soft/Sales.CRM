package com.andersenlab.crm.services;

import com.andersenlab.crm.model.entities.Token;
import com.andersenlab.crm.model.entities.VerificationKey;

import java.time.LocalDateTime;

public interface TokenService {

    void save(Token token);

    void update(String oldRefreshToken, Token token);

    Token findTokenByValue(String refreshToken);

    void delete(Token found);

    void deleteByCreateDateBefore(LocalDateTime dateTime);

    VerificationKey saveVerificationKey(VerificationKey verificationKey);

    VerificationKey findVerificationKeyByTokenKey(String tokenKey);

    void deleteVerificationKey(String tokenKey);

    void deleteExpiredVerificationKeys(LocalDateTime dateTime);
}
