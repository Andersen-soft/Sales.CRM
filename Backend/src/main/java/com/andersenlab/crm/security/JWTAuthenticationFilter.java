package com.andersenlab.crm.security;

import com.andersenlab.crm.configuration.properties.TokenProperties;
import com.andersenlab.crm.rest.request.LoginRequest;
import com.andersenlab.crm.rest.response.AuthenticationInfo;
import com.andersenlab.crm.utils.ResponseWriter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Collection;

import static org.apache.commons.lang3.StringUtils.isEmpty;


@Slf4j
@AllArgsConstructor
public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final TokenManager tokenManager;
    private final AuthHandler authHandler;
    private final ObjectMapper objectMapper;
    private final TokenProperties tokenProperties;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest req,
                                                HttpServletResponse res) {

        return authHandler.authenticate(getLoginRequest(req));
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request,
                                            HttpServletResponse response,
                                            FilterChain chain,
                                            Authentication auth) {
        TokenPair tokenPair = tokenManager.createTokenPair(getUsername(auth));
        AuthenticationInfo userInfo = buildAuthenticationInfo(auth);
        ResponseWriter.<AuthenticationInfo>writer(response)
                .addHeader("Authorization", tokenPair.getAccessToken())
                .addHeader("Refresh", tokenPair.getRefreshToken())
                .addHeader("Access_expires", getFormatDate())
                .addHeader("Access-Control-Expose-Headers", "Authorization, Refresh")
                .setData(userInfo);
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request,
                                              HttpServletResponse response,
                                              AuthenticationException failed) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        ResponseWriter.writer(response)
                .setSuccess(false)
                .setErrorMessage(failed.getMessage())
                .setResponseCode(HttpStatus.BAD_REQUEST.value());
    }

    private AuthenticationInfo buildAuthenticationInfo(Authentication auth) {
        return AuthenticationInfo.builder()
                .roles(getAuthorities(auth))
                .username(getUsername(auth))
                .id(getUserId(auth))
                .employeeLang(getEmployeeLang(auth))
                .build();
    }

    private LoginRequest getLoginRequest(HttpServletRequest req) {
        try {
            LoginRequest loginRequest = objectMapper.readValue(req.getInputStream(), LoginRequest.class);
            if (!isValid(loginRequest)) {
                throw new BadCredentialsException("Bad or empty credentials, check username and password");
            }
            return loginRequest;
        } catch (IOException e) {
            throw new HttpMessageNotReadableException("Message not readable", e);
        }
    }

    private boolean isValid(LoginRequest loginRequest) {
        return !(isEmpty(loginRequest.getUsername()) || isEmpty(loginRequest.getPassword()));
    }

    private String getUsername(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getUsername();
    }

    private Long getUserId(Authentication authentication) {
        return (Long) getDetails(authentication)[0];
    }

    private String getEmployeeLang(Authentication authentication) {
        return (String) getDetails(authentication)[1];
    }

    public static Object[] getDetails(Authentication authentication){
        return (Object[]) authentication.getDetails();
    }

    private String[] getAuthorities(Authentication authentication) {
        Collection<GrantedAuthority> authorities = ((User) authentication.getPrincipal()).getAuthorities();
        if (authorities.isEmpty()) {
            return new String[]{"none"};
        }
        return authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .toArray(String[]::new);
    }

    private String getFormatDate() {
        return LocalDateTime.now()
                .plus(tokenProperties.getRefreshExpirationTimeMillis(), ChronoUnit.MILLIS)
                .format(DateTimeFormatter.ISO_DATE_TIME);
    }
}
