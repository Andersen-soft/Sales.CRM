package com.andersenlab.crm.utils;

import com.andersenlab.crm.rest.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;
import org.springframework.http.MediaType;

import javax.servlet.http.HttpServletResponse;

public class ResponseWriter<T> {

    private final HttpServletResponse response;
    private final BaseResponse<T> responseBody;
    private final ObjectMapper objectMapper;

    private ResponseWriter(HttpServletResponse response) {
        this.response = response;
        this.response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
        this.responseBody = new BaseResponse<>();
        this.objectMapper = new ObjectMapper();
        rewriteBody();
    }

    public static <T> ResponseWriter<T> writer(HttpServletResponse response) {
        return new ResponseWriter<>(response);
    }

    public ResponseWriter<T> addHeader(String name, String value) {
        response.addHeader(name, value);
        return this;
    }

    public ResponseWriter<T> setSuccess(boolean success) {
        responseBody.setSuccess(success);
        rewriteBody();
        return this;
    }

    public ResponseWriter<T> setResponseCode(int responseCode) {
        responseBody.setResponseCode(responseCode);
        rewriteBody();
        return this;
    }

    public ResponseWriter<T> setErrorMessage(String message) {
        responseBody.setErrorMessage(message);
        rewriteBody();
        return this;
    }

    public ResponseWriter<T> setData(T data) {
        responseBody.setData(data);
        rewriteBody();
        return this;
    }

    @SneakyThrows
    private HttpServletResponse rewriteBody() {
        response.resetBuffer();
        response.getOutputStream().write(objectMapper.writeValueAsBytes(responseBody));
        return response;
    }
}
