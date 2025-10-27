package com.montelzek.mydorm.dashboard.payload;

import com.montelzek.mydorm.announcement.payload.AnnouncementPayload;
import com.montelzek.mydorm.event.payload.EventPayload;

import java.util.List;

public record AdminDashboardData(
        AdminDashboardStats stats,
        IssueStats issueStats,
        List<RecentIssuePayload> recentIssues,
        List<EventPayload> upcomingEvents,
        List<RecentReservationPayload> recentReservations,
        List<AnnouncementPayload> activeAnnouncements
) {}


