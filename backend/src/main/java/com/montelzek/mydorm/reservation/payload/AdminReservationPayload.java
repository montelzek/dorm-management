package com.montelzek.mydorm.reservation.payload;

public record AdminReservationPayload(
        Long id,
        String firstName,
        String lastName,
        String userBuildingName,
        String userRoomNumber,
        String resourceName,
        String resourceBuildingName,
        String startTime,
        String endTime,
        String date,
        String status
) {}

