package com.montelzek.mydorm.exception;

import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.LocaleResolver;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final MessageSource messageSource;
    private final LocaleResolver localeResolver;

    public GlobalExceptionHandler(MessageSource messageSource, LocaleResolver localeResolver) {
        this.messageSource = messageSource;
        this.localeResolver = localeResolver;
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        var locale = localeResolver.resolveLocale(request);
        String message = messageSource.getMessage(ex.getErrorCode(), null, ex.getMessage(), locale);
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildSimpleErrorResponse(message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex, HttpServletRequest request) {
        var locale = localeResolver.resolveLocale(request);
        String message = messageSource.getMessage("VALIDATION_ERROR", null, ex.getMessage(), locale);
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildSimpleErrorResponse(message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalStateException(IllegalStateException ex, HttpServletRequest request) {
        var locale = localeResolver.resolveLocale(request);
        String message = messageSource.getMessage("VALIDATION_ERROR", null, ex.getMessage(), locale);
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildSimpleErrorResponse(message);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(HttpServletRequest request) {
        var locale = localeResolver.resolveLocale(request);
        String message = messageSource.getMessage("INTERNAL_ERROR", null, "Server error occurred", locale);
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildSimpleErrorResponse(message);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
