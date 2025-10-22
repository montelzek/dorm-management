package com.montelzek.mydorm.building.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateBuildingInput(
        @NotBlank @Size(max = 100) String name,
        @NotBlank String address
) {}

