package com.montelzek.mydorm.exception;

import lombok.Getter;

@Getter
public enum ErrorCodes {
    // Business Logic Errors
    RESOURCE_CONFLICT("RESOURCE_CONFLICT", "Zasób jest już zarezerwowany w wybranym przedziale czasowym"),
    INVALID_TIME("INVALID_TIME", "Nieprawidłowy czas rezerwacji"),
    INVALID_DATE("INVALID_DATE", "Nieprawidłowa data rezerwacji"),
    RESERVATION_TOO_LONG("RESERVATION_TOO_LONG", "Rezerwacja nie może trwać dłużej niż 5 godzin"),
    OUTSIDE_HOURS("OUTSIDE_HOURS", "Rezerwacja poza dozwolonymi godzinami"),
    
    // Validation Errors
    VALIDATION_ERROR("VALIDATION_ERROR", "Błąd walidacji danych"),
    REQUIRED_FIELD("REQUIRED_FIELD", "Pole jest wymagane"),
    INVALID_FORMAT("INVALID_FORMAT", "Nieprawidłowy format danych"),
    
    // Authentication & Authorization
    UNAUTHORIZED("UNAUTHORIZED", "Brak autoryzacji"),
    FORBIDDEN("FORBIDDEN", "Brak uprawnień"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Nieprawidłowe dane logowania"),
    
    // Resource Errors
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Zasób nie został znaleziony"),
    USER_NOT_FOUND("USER_NOT_FOUND", "Użytkownik nie został znaleziony"),
    BUILDING_NOT_FOUND("BUILDING_NOT_FOUND", "Budynek nie został znaleziony"),
    
    // System Errors
    INTERNAL_ERROR("INTERNAL_ERROR", "Wystąpił nieoczekiwany błąd serwera"),
    DATABASE_ERROR("DATABASE_ERROR", "Błąd bazy danych"),
    NETWORK_ERROR("NETWORK_ERROR", "Błąd połączenia sieciowego");
    
    private final String code;
    private final String defaultMessage;
    
    ErrorCodes(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

}
