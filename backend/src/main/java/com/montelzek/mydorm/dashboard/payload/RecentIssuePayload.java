package com.montelzek.mydorm.dashboard.payload;

import java.time.LocalDateTime;

public record RecentIssuePayload(
        Long id,
        String title,
        String status,
        String priority,
        String userName,
        String buildingName,
        LocalDateTime createdAt
) {}


