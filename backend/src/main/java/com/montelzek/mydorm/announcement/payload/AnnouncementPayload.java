package com.montelzek.mydorm.announcement.payload;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record AnnouncementPayload(
        Long id,
        String title,
        String content,
        String category,
        LocalDate startDate,
        LocalDate endDate,
        List<AnnouncementBuildingPayload> buildings,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}


