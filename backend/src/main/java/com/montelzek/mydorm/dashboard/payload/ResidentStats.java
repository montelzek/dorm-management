package com.montelzek.mydorm.dashboard.payload;

public record ResidentStats(
        Integer totalReservations,
        Integer totalIssues,
        Integer activeListings
) {}


