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
}
