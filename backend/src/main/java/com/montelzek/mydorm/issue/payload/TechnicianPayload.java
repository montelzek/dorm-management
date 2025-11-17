package com.montelzek.mydorm.issue.payload;

public record TechnicianPayload(
        Long id,
        String firstName,
        String lastName,
        String email
) {
}
