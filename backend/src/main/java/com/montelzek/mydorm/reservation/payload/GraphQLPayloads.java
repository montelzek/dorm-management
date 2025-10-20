package com.montelzek.mydorm.reservation.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class GraphQLPayloads {
    public record CreateReservationInput(
        @NotNull Long resourceId, 
        @NotBlank String startTime, 
        @NotBlank String endTime
    ) {}
    public record TimeSlot(String startTime, String endTime) {}
    public record BuildingPayload(Long id, String name) {}
    public record ReservationResourcePayload(Long id, String name, String resourceType) {}
    public record UserPayload(Long id, String firstName, String lastName, String role, BuildingPayload building) {}
    public record ReservationPayload(Long id, String startTime, String endTime, String status, ReservationResourcePayload resource, UserPayload user) {}
}
