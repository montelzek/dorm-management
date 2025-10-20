package com.montelzek.mydorm.constants;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

public final class ApplicationConstants {
    
    private ApplicationConstants() {

    }
    
    // ========== TIME ZONES ==========
    public static final ZoneId DORMITORY_TIMEZONE = ZoneId.of("Europe/Warsaw");
    // Usunięto UTC_TIMEZONE - używamy tylko Europe/Warsaw
    
    // ========== RESERVATION CONSTRAINTS ==========
    public static final LocalTime EARLIEST_RESERVATION_TIME = LocalTime.of(8, 0);
    public static final LocalTime LATEST_RESERVATION_TIME = LocalTime.of(23, 0);
    public static final int MAX_RESERVATION_DURATION_HOURS = 5;
    
    // ========== LAUNDRY SLOTS ==========
    public static final List<LocalTime[]> LAUNDRY_SLOTS = List.of(
        new LocalTime[]{LocalTime.of(8, 0), LocalTime.of(11, 0)},
        new LocalTime[]{LocalTime.of(11, 0), LocalTime.of(14, 0)},
        new LocalTime[]{LocalTime.of(14, 0), LocalTime.of(17, 0)},
        new LocalTime[]{LocalTime.of(17, 0), LocalTime.of(20, 0)},
        new LocalTime[]{LocalTime.of(20, 0), LocalTime.of(23, 0)}
    );
    
    // ========== STANDARD RESOURCE SLOTS ==========
    public static final LocalTime STANDARD_SLOT_START = LocalTime.of(8, 0);
    public static final LocalTime STANDARD_SLOT_END = LocalTime.of(23, 0);
    public static final LocalTime STANDARD_SLOT_LAST_END = LocalTime.of(23, 59, 59);
    
    // ========== VALIDATION MESSAGES ==========
    public static final String INVALID_TIME_FORMAT_MESSAGE = "Rezerwacje muszą rozpoczynać się i kończyć o pełnych godzinach (np. 09:00)";
    public static final String RESERVATION_TOO_LONG_MESSAGE = "Reservation cannot last longer than 5 hours";
    public static final String OUTSIDE_HOURS_START_MESSAGE = "Reservation cannot start before 08:00";
    public static final String OUTSIDE_HOURS_END_MESSAGE = "Reservation cannot end after 23:00";
    public static final String INVALID_DATE_MESSAGE = "Reservation must start and end on the same day";
    public static final String PAST_RESERVATION_MESSAGE = "Cannot reserve time slots in the past";
}
