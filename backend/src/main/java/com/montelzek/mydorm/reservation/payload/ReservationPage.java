package com.montelzek.mydorm.reservation.payload;

import java.util.List;

public record ReservationPage(
        List<AdminReservationPayload> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {}

