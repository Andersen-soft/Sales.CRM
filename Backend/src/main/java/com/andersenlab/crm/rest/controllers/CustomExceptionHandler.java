package com.andersenlab.crm.rest.controllers;

import com.andersenlab.crm.exceptions.CrmAuthException;
import com.andersenlab.crm.exceptions.CrmException;
import com.andersenlab.crm.exceptions.CrmExceptionWithBody;
import com.andersenlab.crm.exceptions.ResourceNotFoundException;
import com.andersenlab.crm.model.entities.Employee;
import com.andersenlab.crm.rest.BaseResponse;
import com.andersenlab.crm.security.AuthenticatedUser;
import com.andersenlab.crm.services.i18n.I18nService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.persistence.EntityNotFoundException;
import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

import static com.andersenlab.crm.services.i18n.I18nConstants.LANGUAGE_TAG_RU;

/**
 * Custom exception handler.
 * Contains methods, used for intercepting exceptions from other controllers
 * and wrapping those exceptions into BaseResponse.
 *
 * @see BaseResponse
 */
@RestControllerAdvice(basePackages = {"com.andersenlab.crm.rest.controllers"})
@RequiredArgsConstructor
public class CustomExceptionHandler {
    private final AuthenticatedUser authenticatedUser;
    private final I18nService i18n;

    /**
     * Intercepts ResourceNotFoundException in controllers and wraps them into CustomExceptionHandler
     * Supports the consistency of server responses
     *
     * @param e - the thrown exception
     * @return BaseResponse - the response with error message and description
     * @see BaseResponse
     * @see ResourceNotFoundException
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public BaseResponse handleResourceNotFound(ResourceNotFoundException e) {
        return BaseResponse.buildErrorResponse(404, e);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public BaseResponse handleMessageNotReadable(HttpMessageNotReadableException e) {
        BaseResponse response = new BaseResponse();
        response.setSuccess(false);
        response.setResponseCode(HttpStatus.BAD_REQUEST.value());
        response.setErrorMessage("Error converting http message");
        return response;
    }

    /**
     * Intercepts exceptions in controllers and wraps them into CustomExceptionHandler
     * Supports the consistency of server responses
     *
     * @param e - the thrown exception
     * @return BaseResponse - the response with error message and description
     * @see BaseResponse
     * @see CrmException
     */
    @ExceptionHandler(CrmException.class)
    public BaseResponse handleException(CrmException e) {
        CrmException localizedException = new CrmException(
                i18n.getLocalizedMessage(e.getMessage(),
                        Locale.forLanguageTag(getLaguageTag()))
        );
        return BaseResponse.buildErrorResponse(400, localizedException);
    }

    @ExceptionHandler(CrmExceptionWithBody.class)
    public BaseResponse handleException(CrmExceptionWithBody e) {
        return BaseResponse.builder()
                .success(false)
                .responseCode(HttpStatus.BAD_REQUEST.value())
                .errorMessage(e.getMessage())
                .data(e.getBody())
                .build();
    }

    @ExceptionHandler(CrmAuthException.class)
    public BaseResponse handleUnauthorizedException(CrmException e) {
        return BaseResponse.buildErrorResponse(403, e);
    }

    /**
     * Intercepts validation exceptions in controllers and wraps them into CustomExceptionHandler
     * Supports the consistency of server responses, constructs readable error message
     *
     * @param e - the thrown exception
     * @return BaseResponse - the response with error message and description
     * @see BaseResponse
     * @see CrmException
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public BaseResponse handleValidation(MethodArgumentNotValidException e) {
        StringBuilder builder = new StringBuilder("Validation failed for: ");
        BindingResult bindingResult = e.getBindingResult();
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        for (FieldError fieldError : fieldErrors) {
            builder.append("field: ").append(fieldError.getField())
                    .append(", rejected value: ")
                    .append(fieldError.getRejectedValue())
                    .append(", cause: ")
                    .append(fieldError.getDefaultMessage());
        }
        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setResponseCode(400);
        baseResponse.setErrorMessage(builder.toString());
        baseResponse.setSuccess(false);
        return baseResponse;
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public BaseResponse handleValidation(ConstraintViolationException e) {
        BaseResponse baseResponse = new BaseResponse();
        baseResponse.setResponseCode(400);
        baseResponse.setErrorMessage(e.getMessage());
        baseResponse.setSuccess(false);
        return baseResponse;
    }

    @ExceptionHandler(PropertyReferenceException.class)
    public BaseResponse handlePropertyReference(PropertyReferenceException e) {
        return BaseResponse.buildErrorResponse(400, e);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public BaseResponse handlePropertyReference(DataIntegrityViolationException e) {
        return BaseResponse.builder()
                .success(false)
                .responseCode(HttpStatus.BAD_REQUEST.value())
                .errorMessage(e.getMostSpecificCause().getMessage())
                .build();
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public BaseResponse handle(EntityNotFoundException e) {
        return BaseResponse.buildErrorResponse(HttpStatus.NOT_FOUND.value(), e);
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    public BaseResponse handle(EmptyResultDataAccessException e) {
        return BaseResponse.buildErrorResponse(HttpStatus.NOT_FOUND.value(), e);
    }

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public BaseResponse handle(RuntimeException e) {
        return BaseResponse.buildErrorResponse(HttpStatus.BAD_REQUEST.value(), e);
    }

    private String getLaguageTag() {
        Employee employee = authenticatedUser.getCurrentEmployee();
        if (employee != null) {
            return Optional.ofNullable(employee.getEmployeeLang()).orElse(LANGUAGE_TAG_RU);
        }
        return LANGUAGE_TAG_RU;

    }
}
