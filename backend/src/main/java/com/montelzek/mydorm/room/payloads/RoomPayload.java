package com.montelzek.mydorm.room.payloads;

import java.math.BigDecimal;

public record RoomPayload(
        Long id,
        String roomNumber,
        Integer capacity,
        Integer currentOccupancy,
        Long standardId,
        String standardName,
        Integer standardCapacity,
        BigDecimal standardPrice,
        Long buildingId,
        String buildingName
) {}
