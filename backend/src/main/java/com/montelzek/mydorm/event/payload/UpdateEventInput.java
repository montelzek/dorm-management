package com.montelzek.mydorm.event.payload;

public record UpdateEventInput(
    String title,
    String description,
    String eventDate,
    String startTime,
    String endTime,
    Long buildingId,
    Long resourceId
) {}

