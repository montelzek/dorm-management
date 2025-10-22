package com.montelzek.mydorm.reservation_resource.payload;

public record AdminResourcePayload(
        Long id,
        String name,
        String description,
        Long buildingId,
        String buildingName,
        boolean isActive,
        String createdAt
) {}

