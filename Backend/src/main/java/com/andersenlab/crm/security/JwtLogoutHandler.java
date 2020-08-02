package com.andersenlab.crm.security;

import com.andersenlab.crm.rest.request.RefreshTokenRequest;
import com.andersenlab.crm.utils.ResponseWriter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@AllArgsConstructor
public class JwtLogoutHandler implements LogoutSuccessHandler {

    private final TokenManager tokenManager;
    private final ObjectMapper objectMapper;

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        RefreshTokenRequest token = objectMapper.readValue(request.getInputStream(), RefreshTokenRequest.class);

        try {
            tokenManager.invalidateToken(token.getToken());
            ResponseWriter.writer(response);
        } catch (AccessDeniedException e) {
            log.error("Logout error: {}", e);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            ResponseWriter.writer(response)
                    .setResponseCode(HttpStatus.UNAUTHORIZED.value())
                    .setErrorMessage(e.getMessage())
                    .setSuccess(false);
        }
    }
}
