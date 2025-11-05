package com.montelzek.mydorm.room.payload;

public record AdminRoomPayload(
        Long id,
        String roomNumber,
        Long buildingId,
        String buildingName,
        int capacity,
        int occupancy,
        Long standardId,
        String standardName,
        int standardCapacity,
        String standardPrice,
        String createdAt
) {}
