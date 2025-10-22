package com.montelzek.mydorm.building.payload;

public record BuildingDetailsPayload(
        Long id,
        String name,
        String address,
        int roomsCount,
        int resourcesCount,
        String createdAt,
        String updatedAt
) {}

