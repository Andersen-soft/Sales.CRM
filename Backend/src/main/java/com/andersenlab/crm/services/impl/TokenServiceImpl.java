package com.andersenlab.crm.services.impl;

import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.model.entities.Token;
import com.andersenlab.crm.model.entities.VerificationKey;
import com.andersenlab.crm.repositories.TokenRepository;
import com.andersenlab.crm.repositories.VerificationKeyRepository;
import com.andersenlab.crm.services.TokenService;
import com.google.common.cache.LoadingCache;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final TokenRepository tokenRepository;
    private final VerificationKeyRepository verificationKeyRepository;

    @Qualifier("refreshTokenCache")
    private final LoadingCache<String, String> cache;

    @Override
    public void save(Token token) {
        tokenRepository.saveAndFlush(token);
    }

    @Override
    @Transactional
    public void update(String oldRefreshToken, Token token) {
        Token oldToken = findTokenByValue(oldRefreshToken);
        if (oldToken == null) {
            try {
                if (cache.get(oldRefreshToken) == null) {
                    throw new IllegalArgumentException("Token is not valid");
                }
            } catch (ExecutionException e) {
                log.error("Error in retrieve token from cache", e);
            }
        } else {
            tokenRepository.delete(oldToken);
            cache.put(oldToken.getValue(), oldToken.getLogin());
            tokenRepository.saveAndFlush(token);
        }
    }

    @Override
    public Token findTokenByValue(String refreshToken) {
        return tokenRepository.findTokenByValue(refreshToken);
    }

    @Override
    public void delete(Token found) {
        tokenRepository.delete(found);
    }

    @Override
    @Transactional
    public void deleteByCreateDateBefore(LocalDateTime dateTime) {
        tokenRepository.deleteByCreateDateBefore(dateTime);
    }

    @Override
    public VerificationKey saveVerificationKey(VerificationKey verificationKey) {
        return verificationKeyRepository.save(verificationKey);
    }

    @Override
    @Transactional(readOnly = true)
    public VerificationKey findVerificationKeyByTokenKey(String tokenKey) {
        return verificationKeyRepository.findByTokenKey(tokenKey)
                .orElseThrow(() -> new CrmException("Ссылка уже использовалась для установки пароля."));
    }

    @Override
    public void deleteVerificationKey(String tokenKey) {
        VerificationKey verificationKey = this.findVerificationKeyByTokenKey(tokenKey);
        verificationKeyRepository.delete(verificationKey);
        log.debug("There was deleted used key {}", tokenKey);
    }

    @Override
    @Transactional
    public void deleteExpiredVerificationKeys(LocalDateTime dateTime) {
        Integer count = verificationKeyRepository.deleteByCreateDateBefore(dateTime);
        log.debug("There were deleted {} expired keys", count);
    }
}
