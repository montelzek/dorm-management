package com.montelzek.mydorm.reservation;

import com.montelzek.mydorm.reservation_resource.ReservationResource;
import com.montelzek.mydorm.reservation_resource.ReservationResourceRepository;
import com.montelzek.mydorm.user.User;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@AllArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationResourceRepository reservationResourceRepository;

    @Transactional
    public Reservation createReservation(LocalDateTime startTime, LocalDateTime endTime, Long resourceId, User user) {

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        ReservationResource resource = reservationResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));

        List<Reservation> conflictingReservations = reservationRepository.findConflictingReservations(resourceId, startTime, endTime);
        if (!conflictingReservations.isEmpty()) {
            throw new IllegalStateException("The resource is already booked in the selected time frame.");
        }

        Reservation newReservation = new Reservation();
        newReservation.setStartTime(startTime);
        newReservation.setEndTime(endTime);
        newReservation.setReservationResource(resource);
        newReservation.setUser(user);
        newReservation.setStatus("CONFIRMED");

        return reservationRepository.save(newReservation);
    }
}
