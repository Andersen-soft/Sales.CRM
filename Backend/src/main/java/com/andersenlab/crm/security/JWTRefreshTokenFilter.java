package com.andersenlab.crm.security;

import com.andersenlab.crm.configuration.properties.TokenProperties;
import com.andersenlab.crm.rest.request.RefreshTokenRequest;
import com.andersenlab.crm.utils.ResponseWriter;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;


@Slf4j
public class JWTRefreshTokenFilter extends GenericFilterBean {

    private final RequestMatcher refreshTokenRequestMatcher;
    private final TokenManager tokenManager;
    private final ObjectMapper objectMapper;
    private  final TokenProperties tokenProperties;

    public JWTRefreshTokenFilter(TokenManager tokenManager, ObjectMapper objectMapper, TokenProperties tokenProperties) {
        this.refreshTokenRequestMatcher = new AntPathRequestMatcher("/refresh_token");
        this.tokenManager = tokenManager;
        this.objectMapper = objectMapper;
        this.tokenProperties = tokenProperties;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        if (requiresRefreshToken(request)) {
            refreshToken(request, response);
            return;
        }

        chain.doFilter(request, response);
    }

    private void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        RefreshTokenRequest token = objectMapper.readValue(request.getInputStream(), RefreshTokenRequest.class);
        try {
            TokenPair tokenPair = tokenManager.refreshTokenPair(token.getToken());
            onSuccessfulRefresh(response, tokenPair);
        } catch (JwtException | AccessDeniedException e) {
            log.error("Refresh value error: {}", e);
            onUnsuccessfulRefresh(response, e);
        }
    }

    private void onSuccessfulRefresh(HttpServletResponse response, TokenPair tokenPair) {
        ResponseWriter
                .writer(response)
                .addHeader("Authorization", tokenPair.getAccessToken())
                .addHeader("Access_expires", getFormatDate())
                .addHeader("Refresh", tokenPair.getRefreshToken())
                .addHeader("Access-Control-Expose-Headers", "Authorization, Refresh")
                .setSuccess(true);
    }

    private void onUnsuccessfulRefresh(HttpServletResponse response, RuntimeException e) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        ResponseWriter
                .writer(response)
                .setSuccess(false)
                .setErrorMessage(e.getMessage())
                .setResponseCode(HttpStatus.BAD_REQUEST.value());
    }

    private String getFormatDate() {
        return LocalDateTime.now()
                .plus(tokenProperties.getRefreshExpirationTimeMillis(), ChronoUnit.MILLIS)
                .format(DateTimeFormatter.ISO_DATE_TIME);
    }

    private boolean requiresRefreshToken(HttpServletRequest request) {
        return refreshTokenRequestMatcher.matches(request);
    }
}
