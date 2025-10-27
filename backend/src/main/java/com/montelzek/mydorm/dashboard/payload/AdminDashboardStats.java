package com.montelzek.mydorm.dashboard.payload;

public record AdminDashboardStats(
        Integer totalResidents,
        Integer totalRooms,
        Integer totalBuildings,
        Integer occupiedRooms,
        Integer availableRooms,
        Integer totalReservations,
        Integer totalIssues
) {}


