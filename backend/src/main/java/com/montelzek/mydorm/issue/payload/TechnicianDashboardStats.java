package com.montelzek.mydorm.issue.payload;

public record TechnicianDashboardStats(
        int activeTasks,
        int resolvedTasks,
        int inProgressTasks,
        int reportedTasks,
        int highPriorityTasks,
        int urgentPriorityTasks
) {
}
