package com.montelzek.mydorm.announcement;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query("SELECT DISTINCT a FROM Announcement a LEFT JOIN FETCH a.buildings")
    Page<Announcement> findAllWithBuildings(Pageable pageable);

    @Query("SELECT DISTINCT a FROM Announcement a LEFT JOIN FETCH a.buildings WHERE a.id = :id")
    Optional<Announcement> findByIdWithBuildings(@Param("id") Long id);

    @Query("SELECT DISTINCT a FROM Announcement a LEFT JOIN FETCH a.buildings b " +
           "WHERE CURRENT_DATE BETWEEN a.startDate AND a.endDate " +
           "AND (b.id IN :buildingIds OR SIZE(a.buildings) = 0)")
    List<Announcement> findActiveAnnouncementsForBuildings(@Param("buildingIds") List<Long> buildingIds);
    
    @Query("SELECT DISTINCT a FROM Announcement a LEFT JOIN FETCH a.buildings " +
           "WHERE CURRENT_DATE BETWEEN a.startDate AND a.endDate " +
           "AND SIZE(a.buildings) = 0")
    List<Announcement> findActiveGlobalAnnouncements();
}

