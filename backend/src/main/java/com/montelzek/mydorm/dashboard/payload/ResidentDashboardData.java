package com.montelzek.mydorm.dashboard.payload;

import com.montelzek.mydorm.announcement.payload.AnnouncementPayload;
import com.montelzek.mydorm.event.payload.EventPayload;
import com.montelzek.mydorm.issue.payload.IssuePayload;
import com.montelzek.mydorm.reservation.payload.GraphQLPayloads.ReservationPayload;

import java.util.List;

public record ResidentDashboardData(
        ResidentUserInfo userInfo,
        ResidentStats stats,
        List<ReservationPayload> myActiveReservations,
        List<IssuePayload> myIssues,
        List<EventPayload> upcomingEvents,
        List<AnnouncementPayload> activeAnnouncements
) {}

