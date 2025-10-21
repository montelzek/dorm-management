package com.montelzek.mydorm.user.payloads;

public record ResidentPayload(
        Long id,
        String firstName,
        String lastName,
        String phone,
        String buildingName,
        String roomNumber
) {}
