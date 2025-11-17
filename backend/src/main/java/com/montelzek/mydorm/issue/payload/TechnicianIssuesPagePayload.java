package com.montelzek.mydorm.issue.payload;

import java.util.List;

public record TechnicianIssuesPagePayload(
        List<TechnicianIssuePayload> content,
        int totalElements,
        int totalPages,
        int currentPage,
        int pageSize
) {
}
