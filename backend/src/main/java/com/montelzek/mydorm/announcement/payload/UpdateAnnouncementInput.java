package com.montelzek.mydorm.announcement.payload;

import java.time.LocalDate;
import java.util.List;

public record UpdateAnnouncementInput(
        String title,
        String content,
        String category,
        LocalDate startDate,
        LocalDate endDate,
        List<Long> buildingIds
) {}


