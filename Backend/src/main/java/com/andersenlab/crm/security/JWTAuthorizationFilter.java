package com.andersenlab.crm.security;

import com.andersenlab.crm.utils.ResponseWriter;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.andersenlab.crm.security.SecurityConstants.ACCESS_HEADER;

@Slf4j
public class JWTAuthorizationFilter extends BasicAuthenticationFilter {

    private final AuthHandler authHandler;
    private final TokenManager tokenManager;

    public JWTAuthorizationFilter(AuthenticationManager authManager,
                                  AuthHandler authHandler, TokenManager tokenManager) {
        super(authManager);
        this.authHandler = authHandler;
        this.tokenManager = tokenManager;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        String token = req.getHeader(ACCESS_HEADER);
        if (token != null) {
            try {
                attemptAuthorization(token);
            } catch (JwtException e) {
                log.error("Error parsing token: {}", e);
                res.setStatus(HttpStatus.UNAUTHORIZED.value());
                ResponseWriter.writer(res)
                        .setResponseCode(HttpStatus.UNAUTHORIZED.value())
                        .setErrorMessage(e.getMessage())
                        .setSuccess(false);
                return;
            }
        }
        chain.doFilter(req, res);
    }

    private void attemptAuthorization(String accessToken) {
        String login = tokenManager.getLogin(accessToken);
        authHandler.authorize(login);
    }
}
