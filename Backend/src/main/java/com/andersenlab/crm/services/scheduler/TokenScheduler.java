package com.andersenlab.crm.services.scheduler;

import com.andersenlab.crm.configuration.properties.TokenProperties;
import com.andersenlab.crm.services.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class TokenScheduler {

    private final TokenService tokenService;
    private final TokenProperties tokenProperties;

    @Scheduled(cron = "0 0 0 ? * WED", zone = "GMT+3")
    public void cleanRefreshTokens() {
        LocalDateTime cleanDate = LocalDateTime.now().minus(tokenProperties.getRefreshExpirationTimeMillis(), ChronoUnit.MILLIS);
        tokenService.deleteByCreateDateBefore(cleanDate);
    }

    @Scheduled(cron = "0 30 0 ? * *", zone = "GMT+3")
    public void cleanVerificationKeys() {
        LocalDateTime cleanDate = LocalDateTime.now().minus(tokenProperties.getRegisterExpirationTimeMillis(), ChronoUnit.MILLIS);
        tokenService.deleteExpiredVerificationKeys(cleanDate);
    }
}
