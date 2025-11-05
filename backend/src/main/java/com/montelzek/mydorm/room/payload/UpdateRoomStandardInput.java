package com.montelzek.mydorm.room.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateRoomStandardInput(
        @NotBlank String name,
        @NotNull @Positive Integer capacity,
        @NotBlank String price
) {}
