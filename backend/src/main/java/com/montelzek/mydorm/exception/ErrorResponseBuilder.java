package com.montelzek.mydorm.exception;

import java.util.HashMap;
import java.util.Map;

public class ErrorResponseBuilder {
    
    private ErrorResponseBuilder() {}

    public static Map<String, Object> buildSimpleErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", message);
        return errorResponse;
    }

    
    public static Map<String, Object> buildSimpleGraphQLExtensions() {
        Map<String, Object> extensions = new HashMap<>();
        extensions.put("code", "USER_ERROR");
        return extensions;
    }

    public static Map<String, Object> buildFromBusinessException(BusinessException ex) {
        return buildSimpleErrorResponse(ex.getMessage());
    }

    public static Map<String, Object> buildGraphQLExtensionsFromBusinessException(BusinessException ex) {
        return buildSimpleGraphQLExtensions();
    }
}
