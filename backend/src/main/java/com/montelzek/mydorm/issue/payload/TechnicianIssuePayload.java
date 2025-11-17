package com.montelzek.mydorm.issue.payload;

public record TechnicianIssuePayload(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        String createdAt,
        String updatedAt,
        IssueUserPayload user,
        IssueRoomPayload room,
        IssueBuildingPayload building
) {
}
