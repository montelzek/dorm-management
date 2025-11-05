package com.montelzek.mydorm.room.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRoomInput(
        @NotBlank @Size(max = 20) String roomNumber,
        @NotNull Long buildingId,
        @NotNull Integer capacity,
        @NotNull Long standardId
) {}
