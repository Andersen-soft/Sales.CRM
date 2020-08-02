package com.andersenlab.crm.security;

import com.andersenlab.crm.utils.ResponseWriter;
import lombok.AllArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@AllArgsConstructor
public class UnauthorizedErrorAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @SuppressWarnings("unchecked")
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) {

        ResponseWriter.writer(response)
                .setSuccess(false)
                .setErrorMessage(exception.getMessage())
                .setResponseCode(403);
    }
}
