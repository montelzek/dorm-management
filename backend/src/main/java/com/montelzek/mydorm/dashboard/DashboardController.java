package com.montelzek.mydorm.dashboard;

import com.montelzek.mydorm.dashboard.payload.AdminDashboardData;
import com.montelzek.mydorm.dashboard.payload.ResidentDashboardData;
import com.montelzek.mydorm.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardData adminDashboard() {
        return dashboardService.getAdminDashboard();
    }

    @QueryMapping
    @PreAuthorize("hasRole('RESIDENT')")
    public ResidentDashboardData residentDashboard(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return dashboardService.getResidentDashboard(userDetails.getId());
    }
}

