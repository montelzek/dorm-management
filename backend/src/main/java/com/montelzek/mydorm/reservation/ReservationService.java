package com.montelzek.mydorm.reservation;

import com.montelzek.mydorm.constants.ApplicationConstants;
import com.montelzek.mydorm.exception.BusinessException;
import com.montelzek.mydorm.exception.ErrorCodes;
import com.montelzek.mydorm.reservation.payload.GraphQLPayloads;
import com.montelzek.mydorm.reservation_resource.EResourceType;
import com.montelzek.mydorm.reservation_resource.ReservationResource;
import com.montelzek.mydorm.reservation_resource.ReservationResourceRepository;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationResourceRepository reservationResourceRepository;
    private final UserRepository userRepository;


    @Transactional
    public Reservation createReservation(ZonedDateTime startTime, ZonedDateTime endTime, Long resourceId, User user) {

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException("Godzina zakończenia musi być późniejsza niż godzina rozpoczęcia.");
        }

        ReservationResource resource = reservationResourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Zasób o podanym ID nie został znaleziony: " + resourceId));

        User currentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("Uwierzytelniony użytkownik nie został znaleziony"));

        ZoneId dormitoryZone = ApplicationConstants.DORMITORY_TIMEZONE;

        if (resource.getResourceType() == EResourceType.LAUNDRY) {

            if (currentUser.getRoom() == null || !currentUser.getRoom().getBuilding().getId().equals(resource.getBuilding().getId())) {
                throw new IllegalStateException("Możesz rezerwować pralnię tylko w swoim budynku.");
            }

            LocalTime localStartTime = startTime.withZoneSameInstant(dormitoryZone).toLocalTime();
            LocalTime localEndTime = endTime.withZoneSameInstant(dormitoryZone).toLocalTime();


            boolean isSlotValid = ApplicationConstants.LAUNDRY_SLOTS.stream().anyMatch(slot ->
                    localStartTime.equals(slot[0]) && localEndTime.equals(slot[1])
            );

            if (!isSlotValid) {
                throw new IllegalArgumentException("Nieprawidłowy przedział czasowy dla rezerwacji pralni.");
            }

        } else {

            LocalTime localStartTime = startTime.withZoneSameInstant(dormitoryZone).toLocalTime();
            LocalTime localEndTime = endTime.withZoneSameInstant(dormitoryZone).toLocalTime();
            LocalDate localStartDate = startTime.withZoneSameInstant(dormitoryZone).toLocalDate();
            LocalDate localEndDate = endTime.withZoneSameInstant(dormitoryZone).toLocalDate();


            if (localStartTime.isBefore(ApplicationConstants.EARLIEST_RESERVATION_TIME)) {
                throw new BusinessException(ErrorCodes.OUTSIDE_HOURS, ApplicationConstants.OUTSIDE_HOURS_START_MESSAGE, "startTime");
            }
            if (localEndTime.isAfter(ApplicationConstants.LATEST_RESERVATION_TIME)) {
                throw new BusinessException(ErrorCodes.OUTSIDE_HOURS, ApplicationConstants.OUTSIDE_HOURS_END_MESSAGE, "endTime");
            }
            if (!localStartDate.isEqual(localEndDate)) {
                throw new BusinessException(ErrorCodes.INVALID_DATE, ApplicationConstants.INVALID_DATE_MESSAGE, "date");
            }
            if (Duration.between(startTime, endTime).toHours() > ApplicationConstants.MAX_RESERVATION_DURATION_HOURS) {
                throw new BusinessException(ErrorCodes.RESERVATION_TOO_LONG, ApplicationConstants.RESERVATION_TOO_LONG_MESSAGE, "duration");
            }
            if (startTime.getMinute() != 0 || startTime.getSecond() != 0 || endTime.getMinute() != 0 || endTime.getSecond() != 0) {
                throw new BusinessException(ErrorCodes.INVALID_TIME, ApplicationConstants.INVALID_TIME_FORMAT_MESSAGE, "timeFormat");
            }
        }

        LocalDateTime localStartTime = startTime.withZoneSameInstant(dormitoryZone).toLocalDateTime();
        LocalDateTime localEndTime = endTime.withZoneSameInstant(dormitoryZone).toLocalDateTime();
        
        List<Reservation> conflictingReservations = reservationRepository.findConflictingReservations(
                resourceId,
                localStartTime,
                localEndTime
        );

        if (!conflictingReservations.isEmpty()) {
            throw new BusinessException(ErrorCodes.RESOURCE_CONFLICT, "Zasób jest już zarezerwowany w wybranym przedziale czasowym.", "timeSlot");
        }

        Reservation newReservation = new Reservation();
        // Convert UTC time to local time before saving
        newReservation.setStartTime(startTime.withZoneSameInstant(dormitoryZone).toLocalDateTime());
        newReservation.setEndTime(endTime.withZoneSameInstant(dormitoryZone).toLocalDateTime());
        newReservation.setReservationResource(resource);
        newReservation.setUser(currentUser);
        newReservation.setStatus("CONFIRMED");

        return reservationRepository.save(newReservation);
    }

    public List<LocalTime[]> getAvailableLaundrySlots(Long resourceId, LocalDate date) {
        List<LocalTime[]> allSlots = new ArrayList<>(ApplicationConstants.LAUNDRY_SLOTS);
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Reservation> existingReservations = reservationRepository.findConflictingReservations(resourceId, startOfDay, endOfDay);

        existingReservations.forEach(reservation -> allSlots.removeIf(slot ->
                reservation.getStartTime().toLocalTime().equals(slot[0]) &&
                        reservation.getEndTime().toLocalTime().equals(slot[1])
        ));

        return allSlots;
    }

    public List<LocalTime[]> getAvailableStandardSlots(Long resourceId, LocalDate date) {
        List<LocalTime[]> allSlots = new ArrayList<>();

        for (int hour = ApplicationConstants.STANDARD_SLOT_START.getHour(); hour <= ApplicationConstants.STANDARD_SLOT_END.getHour() - 1; hour++) {
            allSlots.add(new LocalTime[]{LocalTime.of(hour, 0), LocalTime.of(hour + 1, 0)});
        }
        allSlots.add(new LocalTime[]{ApplicationConstants.STANDARD_SLOT_END, ApplicationConstants.STANDARD_SLOT_LAST_END});
        
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Reservation> existingReservations = reservationRepository.findConflictingReservations(resourceId, startOfDay, endOfDay);

        existingReservations.forEach(reservation -> {
            LocalTime reservationStart = reservation.getStartTime().toLocalTime();
            LocalTime reservationEnd = reservation.getEndTime().toLocalTime();
            
            allSlots.removeIf(slot -> {
                LocalTime slotStart = slot[0];
                LocalTime slotEnd = slot[1];

                return slotStart.isBefore(reservationEnd) && slotEnd.isAfter(reservationStart);
            });
        });


        return allSlots;
    }

    /**
     * Parses flexible date-time string to ZonedDateTime
     */
    public ZonedDateTime parseFlexibleDateTime(String dateTimeString) {
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

    /**
     * Creates reservation with parsed date-time strings
     */
    @Transactional
    public Reservation createReservationWithParsedTimes(String startTimeString, String endTimeString, Long resourceId, User user) {
        ZonedDateTime parsedStartTime = parseFlexibleDateTime(startTimeString);
        ZonedDateTime parsedEndTime = parseFlexibleDateTime(endTimeString);
        
        return createReservation(parsedStartTime, parsedEndTime, resourceId, user);
    }

    /**
     * Gets user by ID with proper error handling
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found in the database"));
    }

    /**
     * Converts LocalTime[] slots to GraphQL TimeSlot payloads
     */
    public List<GraphQLPayloads.TimeSlot> convertSlotsToPayloads(List<LocalTime[]> slots, LocalDate date) {
        ZoneId dormitoryZone = ApplicationConstants.DORMITORY_TIMEZONE;
        
        return slots.stream()
                .map(slot -> {
                    ZonedDateTime zonedStartTime = date.atTime(slot[0]).atZone(dormitoryZone);
                    ZonedDateTime zonedEndTime = date.atTime(slot[1]).atZone(dormitoryZone);

                    String startTimeStr = zonedStartTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
                    String endTimeStr = zonedEndTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

                    return new GraphQLPayloads.TimeSlot(startTimeStr, endTimeStr);
                })
                .collect(Collectors.toList());
    }

    /**
     * Gets available laundry slots as GraphQL payloads
     */
    public List<GraphQLPayloads.TimeSlot> getAvailableLaundrySlotsAsPayloads(Long resourceId, String dateString) {
        LocalDate date = LocalDate.parse(dateString);
        List<LocalTime[]> slots = getAvailableLaundrySlots(resourceId, date);
        return convertSlotsToPayloads(slots, date);
    }

    /**
     * Gets available standard slots as GraphQL payloads
     */
    public List<GraphQLPayloads.TimeSlot> getAvailableStandardSlotsAsPayloads(Long resourceId, String dateString) {
        LocalDate date = LocalDate.parse(dateString);
        List<LocalTime[]> slots = getAvailableStandardSlots(resourceId, date);
        return convertSlotsToPayloads(slots, date);
    }

    /**
     * Converts Reservation entity to GraphQL payload
     */
    public GraphQLPayloads.ReservationPayload toPayload(Reservation reservation) {
        User user = reservation.getUser();
        ReservationResource resource = reservation.getReservationResource();

        GraphQLPayloads.BuildingPayload buildingPayload = user.getRoom() != null && user.getRoom().getBuilding() != null ?
                new GraphQLPayloads.BuildingPayload(user.getRoom().getBuilding().getId(), user.getRoom().getBuilding().getName()) : null;

        GraphQLPayloads.UserPayload userPayload = new GraphQLPayloads.UserPayload(user.getId(), user.getFirstName(), user.getLastName(), buildingPayload);
        GraphQLPayloads.ReservationResourcePayload resourcePayload = new GraphQLPayloads.ReservationResourcePayload(resource.getId(), resource.getName(), resource.getResourceType().name());

        ZoneId dormitoryZone = ApplicationConstants.DORMITORY_TIMEZONE;
        String startTimeAsUtcString = reservation.getStartTime().atZone(dormitoryZone).withZoneSameInstant(ApplicationConstants.UTC_TIMEZONE).format(DateTimeFormatter.ISO_INSTANT);
        String endTimeAsUtcString = reservation.getEndTime().atZone(dormitoryZone).withZoneSameInstant(ApplicationConstants.UTC_TIMEZONE).format(DateTimeFormatter.ISO_INSTANT);

        return new GraphQLPayloads.ReservationPayload(
                reservation.getId(),
                startTimeAsUtcString,
                endTimeAsUtcString,
                reservation.getStatus(),
                resourcePayload,
                userPayload
        );
    }

    /**
     * Gets user's reservations as GraphQL payloads
     */
    public List<GraphQLPayloads.ReservationPayload> getUserReservationsAsPayloads(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }
}
