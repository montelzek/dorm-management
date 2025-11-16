package com.montelzek.mydorm.user.payloads;

public record UserProfilePayload(
        Long id,
        String firstName,
        String lastName,
        String email
) {
}
