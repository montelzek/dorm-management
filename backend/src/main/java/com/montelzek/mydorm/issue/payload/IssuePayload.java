package com.montelzek.mydorm.issue.payload;

public record IssuePayload(
        Long id,
        String title,
        String description,
        String status,
        String priority,
        String createdAt,
        String updatedAt,
        IssueRoomPayload room,
        IssueBuildingPayload building
) {}

