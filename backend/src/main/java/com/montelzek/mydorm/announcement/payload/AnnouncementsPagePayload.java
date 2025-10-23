package com.montelzek.mydorm.announcement.payload;

import java.util.List;

public record AnnouncementsPagePayload(
        List<AnnouncementPayload> content,
        Integer totalElements,
        Integer totalPages,
        Integer currentPage
) {}


