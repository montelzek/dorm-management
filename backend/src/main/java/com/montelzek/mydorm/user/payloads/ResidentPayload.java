package com.montelzek.mydorm.user.payloads;

public record ResidentPayload(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String buildingName,
        Long buildingId,
        String roomNumber,
        Long roomId
) {}
