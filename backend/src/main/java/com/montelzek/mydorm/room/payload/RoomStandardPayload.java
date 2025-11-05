package com.montelzek.mydorm.room.payload;

public record RoomStandardPayload(
        Long id,
        String code,
        String name,
        Integer capacity,
        String price,
        String createdAt,
        String updatedAt
) {}
