package com.montelzek.mydorm.reservation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserId(Long userId);

    @Query("SELECT r FROM Reservation r WHERE r.reservationResource.id = :resourceId AND r.startTime < :endTime AND r.endTime > :startTime AND r.status = 'CONFIRMED'")
    List<Reservation> findConflictingReservations(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId AND r.startTime < :endTime AND r.endTime > :startTime AND r.status = 'CONFIRMED'")
    List<Reservation> findUserConflictingReservations(
            @Param("userId") Long userId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    @Query("SELECT COUNT(r) > 0 FROM Reservation r WHERE r.user.id = :userId AND r.status = 'CONFIRMED' AND r.endTime > :now")
    boolean hasActiveReservations(@Param("userId") Long userId, @Param("now") LocalDateTime now);

    // Admin queries for future confirmed reservations
    @Query("SELECT r FROM Reservation r WHERE r.status = 'CONFIRMED' AND r.startTime > :now")
    Page<Reservation> findFutureConfirmedReservations(@Param("now") LocalDateTime now, Pageable pageable);

    @Query("SELECT r FROM Reservation r LEFT JOIN r.user u LEFT JOIN u.room room WHERE r.status = 'CONFIRMED' AND r.startTime > :now AND " +
            "(:resourceId IS NULL OR r.reservationResource.id = :resourceId) AND " +
            "(:buildingId IS NULL OR r.reservationResource.building.id = :buildingId) AND " +
            "(:date IS NULL OR CAST(r.startTime AS LocalDate) = :date) AND " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(room.roomNumber) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(r.reservationResource.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Reservation> findFutureConfirmedReservationsWithFilters(
            @Param("resourceId") Long resourceId,
            @Param("buildingId") Long buildingId,
            @Param("date") LocalDate date,
            @Param("search") String search,
            @Param("now") LocalDateTime now,
            Pageable pageable
    );
}
