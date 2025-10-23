package com.montelzek.mydorm.event.payload;

public record EventPayload(
    Long id,
    String title,
    String description,
    String eventDate,
    String startTime,
    String endTime,
    EventBuildingPayload building,
    EventResourcePayload resource,
    String createdAt,
    String updatedAt
) {}

