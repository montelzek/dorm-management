package com.montelzek.mydorm.user.payloads;

import java.util.List;

public record ResidentPage(
        List<ResidentPayload> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {}

