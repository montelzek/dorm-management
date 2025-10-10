package com.montelzek.mydorm.auth.payload;

import java.util.List;

public record JwtResponse(
        String token,
        Long id,
        String email,
        String firstName,
        List<String> roles
) {}
