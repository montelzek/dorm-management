package com.montelzek.mydorm.marketplace.payload;

public record ContactInfoPayload(
        String email,
        String phone,
        String firstName,
        String lastName
) {}


