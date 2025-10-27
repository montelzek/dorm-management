package com.montelzek.mydorm.dashboard.payload;

public record ResidentUserInfo(
        Long id,
        String firstName,
        String lastName,
        String email,
        String phone,
        String roomNumber,
        String buildingName
) {}


