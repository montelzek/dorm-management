package com.montelzek.mydorm.reservation;

import com.montelzek.mydorm.reservation.payload.GraphQLPayloads;
import com.montelzek.mydorm.reservation_resource.ReservationResource;
import com.montelzek.mydorm.security.UserDetailsImpl;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@AllArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public GraphQLPayloads.ReservationPayload createReservation(
            @Argument GraphQLPayloads.CreateReservationInput input,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in the database"));

        ZonedDateTime parsedStartTime = parseFlexibleDateTime(input.startTime());
        ZonedDateTime parsedEndTime = parseFlexibleDateTime(input.endTime());

        Reservation createdReservation = reservationService.createReservation(
                parsedStartTime,
                parsedEndTime,
                input.resourceId(),
                currentUser
        );

        return toPayload(createdReservation);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<GraphQLPayloads.ReservationPayload> myReservations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reservationRepository.findByUserId(userDetails.getId()).stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<GraphQLPayloads.TimeSlot> availableLaundrySlots(@Argument Long resourceId, @Argument String date) {
        List<LocalTime[]> slots = reservationService.getAvailableLaundrySlots(resourceId, LocalDate.parse(date));
        LocalDate parsedDate = LocalDate.parse(date);

        ZoneId dormitoryZone = ZoneId.of("Europe/Warsaw");

        return slots.stream()
                .map(slot -> {
                    ZonedDateTime zonedStartTime = parsedDate.atTime(slot[0]).atZone(dormitoryZone);
                    ZonedDateTime zonedEndTime = parsedDate.atTime(slot[1]).atZone(dormitoryZone);

                    String startTimeStr = zonedStartTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                    String endTimeStr = zonedEndTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

                    return new GraphQLPayloads.TimeSlot(startTimeStr, endTimeStr);
                })
                .collect(Collectors.toList());
    }

    private GraphQLPayloads.ReservationPayload toPayload(Reservation reservation) {
        User user = reservation.getUser();
        ReservationResource resource = reservation.getReservationResource();

        GraphQLPayloads.BuildingPayload buildingPayload = user.getRoom() != null && user.getRoom().getBuilding() != null ?
                new GraphQLPayloads.BuildingPayload(user.getRoom().getBuilding().getId(), user.getRoom().getBuilding().getName()) : null;

        GraphQLPayloads.UserPayload userPayload = new GraphQLPayloads.UserPayload(user.getId(), user.getFirstName(), user.getLastName(), buildingPayload);
        GraphQLPayloads.ReservationResourcePayload resourcePayload = new GraphQLPayloads.ReservationResourcePayload(resource.getId(), resource.getName(), resource.getResourceType().name());

        String startTimeAsUtcString = reservation.getStartTime().atZone(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_INSTANT);
        String endTimeAsUtcString = reservation.getEndTime().atZone(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_INSTANT);

        return new GraphQLPayloads.ReservationPayload(
                reservation.getId(),
                startTimeAsUtcString,
                endTimeAsUtcString,
                reservation.getStatus(),
                resourcePayload,
                userPayload
        );
    }

    private ZonedDateTime parseFlexibleDateTime(String dateTimeString) {
        try {
            return ZonedDateTime.parse(dateTimeString);
        } catch (DateTimeParseException e) {
            try {
                return LocalDateTime.parse(dateTimeString).atZone(ZoneId.systemDefault());
            } catch (DateTimeParseException e2) {
                throw new IllegalArgumentException("Invalid date-time format: " + dateTimeString, e2);
            }
        }
    }
}
