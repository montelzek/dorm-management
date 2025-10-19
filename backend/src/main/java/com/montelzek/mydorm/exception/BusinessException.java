package com.montelzek.mydorm.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final String errorCode;
    private final String field;
    
    public BusinessException(ErrorCodes errorCode, String customMessage, String field) {
        super(customMessage);
        this.errorCode = errorCode.getCode();
        this.field = field;
    }
}
