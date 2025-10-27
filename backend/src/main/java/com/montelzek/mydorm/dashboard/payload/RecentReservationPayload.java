package com.montelzek.mydorm.dashboard.payload;

import java.time.LocalDateTime;

public record RecentReservationPayload(
        Long id,
        String userName,
        String resourceName,
        String buildingName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String status
) {}


