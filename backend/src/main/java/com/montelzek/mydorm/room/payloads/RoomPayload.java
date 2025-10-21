package com.montelzek.mydorm.room.payloads;

import java.math.BigDecimal;

public record RoomPayload(
        Long id,
        String roomNumber,
        Integer capacity,
        Integer currentOccupancy,
        BigDecimal rentAmount,
        Long buildingId,
        String buildingName
) {}

