package com.montelzek.mydorm.auth.payload;

import jakarta.validation.constraints.NotBlank;

public record LoginInput(
        @NotBlank String email,
        @NotBlank String password
) {}
