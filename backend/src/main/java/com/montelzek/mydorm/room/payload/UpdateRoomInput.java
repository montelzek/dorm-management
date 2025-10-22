package com.montelzek.mydorm.room.payload;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateRoomInput(
        @NotBlank @Size(max = 20) String roomNumber,
        @NotNull Long buildingId,
        @NotNull Integer capacity,
        @NotNull @Digits(integer = 8, fraction = 2) BigDecimal rentAmount
) {}

