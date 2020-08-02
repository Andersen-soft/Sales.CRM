package com.andersenlab.crm.rest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Base dto class, used for wrapping data and supporting the consistency of server responses.
 *
 * @param <T> Type of response data
 */
@Data
@Builder
@AllArgsConstructor
public class BaseResponse<T> {

    /**
     * Result of request, true - success, false - request failed for some reason
     */
    private Boolean success = true;
    /**
     * The http response code
     */
    private int responseCode = 200;
    /**
     * Data to transfer
     */
    private T data;
    /**
     * The error code
     */
    private String errorCode;
    /**
     * The detail message
     */
    private String errorMessage;

    /**
     * Constructs a new response with the given data object
     *
     * @param data data to transfer
     */
    public BaseResponse(T data) {
        this.data = data;
    }

    /**
     * Constructs a new response with null as its data.
     */
    public BaseResponse() {
    }

    /**
     * Method, that constructs error response with given response code and exception occurred
     *
     * @param responseCode http response code
     * @param e            exception occurred
     * @return the response data transfer object, with specified error code, detail message and http code
     */
    public static BaseResponse buildErrorResponse(int responseCode, Exception e) {
        BaseResponse response = new BaseResponse();
        response.setSuccess(false);
        response.setResponseCode(responseCode);
        response.setErrorMessage(e.getMessage());
        return response;
    }
}
