package com.montelzek.mydorm.building.payload;

public record AdminBuildingPayload(
        Long id,
        String name,
        String address,
        int roomsCount,
        int resourcesCount,
        String createdAt
) {}

