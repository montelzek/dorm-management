package com.montelzek.mydorm.exception;

import lombok.Getter;

@Getter
public enum ErrorCodes {
    RESOURCE_CONFLICT("RESOURCE_CONFLICT", "Zasób jest już zarezerwowany w wybranym przedziale czasowym"),
    INVALID_TIME("INVALID_TIME", "Nieprawidłowy czas rezerwacji"),
    INVALID_DATE("INVALID_DATE", "Nieprawidłowa data rezerwacji"),
    RESERVATION_TOO_LONG("RESERVATION_TOO_LONG", "Rezerwacja nie może trwać dłużej niż 5 godzin"),
    OUTSIDE_HOURS("OUTSIDE_HOURS", "Rezerwacja poza dozwolonymi godzinami"),
    PAST_RESERVATION("PAST_RESERVATION", "Nie można rezerwować terminów w przeszłości"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Błąd walidacji danych"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Nieprawidłowe dane logowania"),
    EMAIL_TAKEN("EMAIL_TAKEN", "Email jest już zajęty"),
    INTERNAL_ERROR("INTERNAL_ERROR", "Wystąpił błąd serwera");
    
    private final String code;
    private final String defaultMessage;
    
    ErrorCodes(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

}
