package com.montelzek.mydorm.reservation_resource.payload;

import java.util.List;

public record ResourcesPagePayload(
        List<AdminResourcePayload> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {}

