package com.montelzek.mydorm.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessException(BusinessException ex) {
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildFromBusinessException(ex);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex) {
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildRestErrorResponse(
            ex.getMessage(), 
            ErrorCodes.VALIDATION_ERROR.getCode(), 
            null
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalStateException(IllegalStateException ex) {
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildRestErrorResponse(
            ex.getMessage(), 
            ErrorCodes.RESOURCE_CONFLICT.getCode(), 
            null
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException() {
        Map<String, Object> errorResponse = ErrorResponseBuilder.buildRestErrorResponse(
            ErrorCodes.INTERNAL_ERROR.getDefaultMessage(), 
            ErrorCodes.INTERNAL_ERROR.getCode(), 
            null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
