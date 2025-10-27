package com.montelzek.mydorm.dashboard.payload;

public record IssueStats(
        Integer reported,
        Integer inProgress,
        Integer resolved,
        Integer lowPriority,
        Integer mediumPriority,
        Integer highPriority
) {}


