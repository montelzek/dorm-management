package com.montelzek.mydorm.event.payload;

import java.util.List;

public record EventsPagePayload(
    List<EventPayload> content,
    int totalElements,
    int totalPages,
    int currentPage,
    int pageSize
) {}

