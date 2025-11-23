package com.montelzek.mydorm.exception;

import lombok.Getter;

@Getter
public enum ErrorCodes {
    RESOURCE_CONFLICT("RESOURCE_CONFLICT", "Resource is already reserved in the selected time slot"),
    USER_RESERVATION_CONFLICT("USER_RESERVATION_CONFLICT", "You already have a reservation in this time slot"),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Requested resource not found"),
    INVALID_TIME("INVALID_TIME", "Invalid reservation time"),
    INVALID_DATE("INVALID_DATE", "Invalid reservation date"),
    RESERVATION_TOO_LONG("RESERVATION_TOO_LONG", "Reservation cannot last longer than 5 hours"),
    OUTSIDE_HOURS("OUTSIDE_HOURS", "Reservation outside allowed hours"),
    PAST_RESERVATION("PAST_RESERVATION", "Cannot reserve time slots in the past"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Data validation error"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid login credentials"),
    EMAIL_TAKEN("EMAIL_TAKEN", "Email is already taken"),
    STANDARD_IN_USE("STANDARD_IN_USE", "Room standard is assigned to one or more rooms"),
    INTERNAL_ERROR("INTERNAL_ERROR", "Server error occurred"),
    LAUNDRY_WEEKLY_LIMIT("LAUNDRY_WEEKLY_LIMIT", "You have reached the weekly limit of 2 laundry reservations"),
    RESOURCE_WEEKLY_LIMIT("RESOURCE_WEEKLY_LIMIT", "You have already reserved this resource once this week");
    
    private final String code;
    private final String defaultMessage;
    
    ErrorCodes(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

}
