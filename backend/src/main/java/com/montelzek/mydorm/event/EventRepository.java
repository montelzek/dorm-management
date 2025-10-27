package com.montelzek.mydorm.event;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE " +
           "(:startDate IS NULL OR e.eventDate >= :startDate) AND " +
           "(:endDate IS NULL OR e.eventDate <= :endDate) AND " +
           "(:buildingId IS NULL OR e.building.id = :buildingId) " +
           "ORDER BY e.eventDate ASC, e.startTime ASC")
    Page<Event> findByFilters(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("buildingId") Long buildingId,
        Pageable pageable
    );

    @Query("SELECT e FROM Event e WHERE " +
           "e.eventDate >= :startDate AND e.eventDate <= :endDate " +
           "ORDER BY e.eventDate ASC, e.startTime ASC")
    List<Event> findByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    List<Event> findByBuildingIdOrderByEventDateAscStartTimeAsc(Long buildingId);

    @Query("SELECT e FROM Event e WHERE e.eventDate >= :date ORDER BY e.eventDate ASC, e.startTime ASC")
    List<Event> findTop5ByEventDateGreaterThanEqualOrderByEventDateAscStartTimeAsc(@Param("date") LocalDate date);

    @Query("SELECT e FROM Event e WHERE e.eventDate >= :date AND " +
           "(:buildingId IS NULL OR e.building.id = :buildingId OR e.building IS NULL) " +
           "ORDER BY e.eventDate ASC, e.startTime ASC")
    List<Event> findTop5ByEventDateAndBuildingOrderByEventDateAsc(
        @Param("date") LocalDate date,
        @Param("buildingId") Long buildingId
    );
}

