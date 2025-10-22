package com.montelzek.mydorm.building.payload;

import java.util.List;

public record BuildingsPagePayload(
        List<AdminBuildingPayload> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {}

