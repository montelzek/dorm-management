package com.montelzek.mydorm.event.payload;

public record CreateEventInput(
    String title,
    String description,
    String eventDate,
    String startTime,
    String endTime,
    Long buildingId,
    Long resourceId
) {}

