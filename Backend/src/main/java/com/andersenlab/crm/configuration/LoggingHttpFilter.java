package com.andersenlab.crm.configuration;

import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.repositories.EmployeeRepository;
import com.andersenlab.crm.security.TokenManager;
import com.andersenlab.crm.utils.ResponseWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.andersenlab.crm.security.SecurityConstants.ACCESS_HEADER;

@Slf4j
@RequiredArgsConstructor
public class LoggingHttpFilter extends GenericFilterBean {
    private final EmployeeRepository employeeRepository;
    private final TokenManager tokenManager;

    private static final String DELIMITER = ", ";

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        final long requestTime = Instant.now().toEpochMilli();

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        final String token = request.getHeader(ACCESS_HEADER);
        log.info("Start Logging Request: {}; {}{}; token = {}.",
                requestTime, request.getMethod(), request.getRequestURI(), token);

        Employee employee = new Employee();

        //добавлена проверка токена для swagger
        //проверить корректность таких действий, проверить настройки веб секьюрити "antMatchers(AUTH_WHITELIST).permitAll()"
        if (token != null) {
            try {
                final String login = tokenManager.getLogin(token);
                employee = employeeRepository.findEmployeeByLogin(login);
                final Map<String, String[]> parameterMap = Optional.ofNullable(request)
                        .map(ServletRequest::getParameterMap)
                        .orElse(Collections.emptyMap());
                final String params = parameterMap
                        .entrySet()
                        .stream()
                        .map(entry -> String.format("%s = %s", entry.getKey(), joinParams(entry.getValue())))
                        .collect(Collectors.joining(DELIMITER));

                log.info("Logging Request: {}; {}{}, params: {}; user id = {}.",
                        requestTime, request.getMethod(), request.getRequestURI(), params, employee.getId());
            } catch (Exception e) {
                log.error("Error in LoggingHttpFilter: {}", e);
                response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                ResponseWriter.writer(response)
                        .setResponseCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .setErrorMessage(e.getMessage())
                        .setSuccess(false);
                return;
            }
        }

        chain.doFilter(request, response);

        final long responseTime = Instant.now().toEpochMilli();

        log.info("Logging Response: {}; code {}; user id = {}.",
                responseTime, response.getStatus(), employee.getId());
    }

    private String joinParams(String[] params) {
        return StringUtils.join(params, DELIMITER);
    }
}
