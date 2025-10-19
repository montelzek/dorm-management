package com.montelzek.mydorm.exception;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public class ErrorResponseBuilder {
    
    private ErrorResponseBuilder() {}

    public static Map<String, Object> buildRestErrorResponse(String message, String code, String field) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", message);
        errorResponse.put("code", code);
        errorResponse.put("timestamp", Instant.now().toString());
        
        if (field != null) {
            errorResponse.put("field", field);
        }
        
        return errorResponse;
    }

    public static Map<String, Object> buildGraphQLErrorExtensions(String code, String field) {
        Map<String, Object> extensions = new HashMap<>();
        extensions.put("code", code);
        extensions.put("field", field != null ? field : "unknown");
        return extensions;
    }

    public static Map<String, Object> buildFromBusinessException(BusinessException ex) {
        return buildRestErrorResponse(ex.getMessage(), ex.getErrorCode(), ex.getField());
    }

    public static Map<String, Object> buildGraphQLExtensionsFromBusinessException(BusinessException ex) {
        return buildGraphQLErrorExtensions(ex.getErrorCode(), ex.getField());
    }
}
