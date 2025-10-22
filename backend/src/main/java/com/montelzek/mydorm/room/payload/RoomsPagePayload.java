package com.montelzek.mydorm.room.payload;

import java.util.List;

public record RoomsPagePayload(
        List<AdminRoomPayload> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {}

