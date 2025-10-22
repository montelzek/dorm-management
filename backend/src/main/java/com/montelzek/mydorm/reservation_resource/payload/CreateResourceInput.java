package com.montelzek.mydorm.reservation_resource.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateResourceInput(
        @NotBlank @Size(max = 100) String name,
        String description,
        @NotNull Long buildingId,
        @NotNull Boolean isActive
) {}

