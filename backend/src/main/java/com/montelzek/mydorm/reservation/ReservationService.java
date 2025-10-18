package com.montelzek.mydorm.reservation;

import com.montelzek.mydorm.reservation_resource.EResourceType;
import com.montelzek.mydorm.reservation_resource.ReservationResource;
import com.montelzek.mydorm.reservation_resource.ReservationResourceRepository;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.ArrayList;
import java.util.List;


@Service
@AllArgsConstructor
public class ReservationService {

    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);

    private final ReservationRepository reservationRepository;
    private final ReservationResourceRepository reservationResourceRepository;
    private final UserRepository userRepository;

    private static final List<LocalTime[]> LAUNDRY_SLOTS = List.of(
            new LocalTime[]{LocalTime.of(8, 0), LocalTime.of(11, 0)},
            new LocalTime[]{LocalTime.of(11, 0), LocalTime.of(14, 0)},
            new LocalTime[]{LocalTime.of(14, 0), LocalTime.of(17, 0)},
            new LocalTime[]{LocalTime.of(17, 0), LocalTime.of(20, 0)},
            new LocalTime[]{LocalTime.of(20, 0), LocalTime.of(23, 0)}
    );

    @Transactional
    public Reservation createReservation(ZonedDateTime startTime, ZonedDateTime endTime, Long resourceId, User user) {

        log.info("Attempting to create reservation for resourceId: {}", resourceId);
        log.info("Received startTime (UTC): {}", startTime);
        log.info("Received endTime (UTC): {}", endTime);

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        ReservationResource resource = reservationResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + resourceId));

        User currentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        ZoneId dormitoryZone = ZoneId.of("Europe/Warsaw");

        if (resource.getResourceType() == EResourceType.LAUNDRY) {

            if (currentUser.getRoom() == null || !currentUser.getRoom().getBuilding().getId().equals(resource.getBuilding().getId())) {
                throw new IllegalStateException("You can only book laundry in your own building.");
            }

            LocalTime localStartTime = startTime.withZoneSameInstant(dormitoryZone).toLocalTime();
            LocalTime localEndTime = endTime.withZoneSameInstant(dormitoryZone).toLocalTime();

            log.info("Validating LAUNDRY slot. Local start: {}, Local end: {}", localStartTime, localEndTime);

            boolean isSlotValid = LAUNDRY_SLOTS.stream().anyMatch(slot ->
                    localStartTime.equals(slot[0]) && localEndTime.equals(slot[1])
            );

            if (!isSlotValid) {
                throw new IllegalArgumentException("Invalid time slot for a laundry booking.");
            }

        } else {

            LocalTime localStartTime = startTime.withZoneSameInstant(dormitoryZone).toLocalTime();
            LocalTime localEndTime = endTime.withZoneSameInstant(dormitoryZone).toLocalTime();
            LocalDate localStartDate = startTime.withZoneSameInstant(dormitoryZone).toLocalDate();
            LocalDate localEndDate = endTime.withZoneSameInstant(dormitoryZone).toLocalDate();

            log.info("Validating STANDARD slot. Local start: {}, Local end: {}", localStartTime, localEndTime);

            if (localStartTime.isBefore(LocalTime.of(8, 0))) {
                throw new IllegalArgumentException("Booking cannot start before 08:00.");
            }
            if (localEndTime.isAfter(LocalTime.of(23, 0))) {
                throw new IllegalArgumentException("Booking cannot end after 23:00.");
            }
            if (!localStartDate.isEqual(localEndDate)) {
                throw new IllegalArgumentException("Booking must start and end on the same day.");
            }
            if (Duration.between(startTime, endTime).toHours() > 5) {
                throw new IllegalArgumentException("Booking cannot be longer than 5 hours.");
            }
            if (startTime.getMinute() != 0 || startTime.getSecond() != 0 || endTime.getMinute() != 0 || endTime.getSecond() != 0) {
                throw new IllegalArgumentException("Bookings must start and end on a full hour (e.g., 09:00).");
            }
        }
        List<Reservation> conflictingReservations = reservationRepository.findConflictingReservations(
                resourceId,
                startTime.toLocalDateTime(),
                endTime.toLocalDateTime()
        );

        if (!conflictingReservations.isEmpty()) {
            throw new IllegalStateException("The resource is already booked in the selected time frame.");
        }

        Reservation newReservation = new Reservation();
        newReservation.setStartTime(startTime.toLocalDateTime());
        newReservation.setEndTime(endTime.toLocalDateTime());
        newReservation.setReservationResource(resource);
        newReservation.setUser(currentUser);
        newReservation.setStatus("CONFIRMED");

        return reservationRepository.save(newReservation);
    }

    public List<LocalTime[]> getAvailableLaundrySlots(Long resourceId, LocalDate date) {
        List<LocalTime[]> allSlots = new ArrayList<>(LAUNDRY_SLOTS);
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Reservation> existingReservations = reservationRepository.findConflictingReservations(resourceId, startOfDay, endOfDay);

        existingReservations.forEach(reservation -> {
            allSlots.removeIf(slot ->
                    reservation.getStartTime().toLocalTime().equals(slot[0]) &&
                            reservation.getEndTime().toLocalTime().equals(slot[1])
            );
        });

        return allSlots;
    }
}
