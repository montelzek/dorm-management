package com.montelzek.mydorm.issue.payload;

import java.util.List;

public record AdminIssuesPagePayload(
        List<AdminIssuePayload> content,
        Integer totalElements,
        Integer totalPages,
        Integer currentPage,
        Integer pageSize
) {}

