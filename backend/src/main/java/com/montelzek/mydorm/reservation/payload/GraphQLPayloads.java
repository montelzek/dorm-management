package com.montelzek.mydorm.reservation.payload;

public class GraphQLPayloads {
    public record CreateReservationInput(Long resourceId, String startTime, String endTime) {}
    public record TimeSlot(String startTime, String endTime) {}
    public record BuildingPayload(Long id, String name) {}
    public record ReservationResourcePayload(Long id, String name, String resourceType) {}
    public record UserPayload(Long id, String firstName, String lastName, BuildingPayload building) {}
    public record ReservationPayload(Long id, String startTime, String endTime, String status, ReservationResourcePayload resource, UserPayload user) {}
}
