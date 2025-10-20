package com.montelzek.mydorm.exception;

import lombok.Getter;

@Getter
public enum ErrorCodes {
    RESOURCE_CONFLICT("RESOURCE_CONFLICT", "Resource is already reserved in the selected time slot"),
    INVALID_TIME("INVALID_TIME", "Invalid reservation time"),
    INVALID_DATE("INVALID_DATE", "Invalid reservation date"),
    RESERVATION_TOO_LONG("RESERVATION_TOO_LONG", "Reservation cannot last longer than 5 hours"),
    OUTSIDE_HOURS("OUTSIDE_HOURS", "Reservation outside allowed hours"),
    PAST_RESERVATION("PAST_RESERVATION", "Cannot reserve time slots in the past"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Data validation error"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid login credentials"),
    EMAIL_TAKEN("EMAIL_TAKEN", "Email is already taken"),
    INTERNAL_ERROR("INTERNAL_ERROR", "Server error occurred");
    
    private final String code;
    private final String defaultMessage;
    
    ErrorCodes(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

}
