package com.montelzek.mydorm.reservation;

import com.montelzek.mydorm.reservation.payload.GraphQLPayloads;
import com.montelzek.mydorm.security.UserDetailsImpl;
import com.montelzek.mydorm.user.User;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public GraphQLPayloads.ReservationPayload createReservation(
            @Argument @Valid GraphQLPayloads.CreateReservationInput input,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User currentUser = reservationService.getUserById(userDetails.getId());
        Reservation createdReservation = reservationService.createReservationWithParsedTimes(
                input.startTime(),
                input.endTime(),
                input.resourceId(),
                currentUser
        );
        return reservationService.toPayload(createdReservation);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<GraphQLPayloads.ReservationPayload> myReservations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reservationService.getUserReservationsAsPayloads(userDetails.getId());
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<GraphQLPayloads.TimeSlot> availableLaundrySlots(@Argument Long resourceId, @Argument String date) {
        return reservationService.getAvailableLaundrySlotsAsPayloads(resourceId, date);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<GraphQLPayloads.TimeSlot> availableStandardSlots(@Argument Long resourceId, @Argument String date) {
        return reservationService.getAvailableStandardSlotsAsPayloads(resourceId, date);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Boolean cancelReservation(
            @Argument Long reservationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return reservationService.cancelReservation(reservationId, userDetails.getId());
    }

}
