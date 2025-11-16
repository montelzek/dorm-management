package com.montelzek.mydorm.room;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    @Query("SELECT DISTINCT r FROM Room r " +
            "LEFT JOIN r.building b " +
            "LEFT JOIN r.users u " +
            "WHERE (:buildingId IS NULL OR r.building.id = :buildingId) AND " +
            "(:status IS NULL OR :status = 'ALL' OR " +
            "(:status = 'FREE' AND SIZE(r.users) = 0) OR " +
            "(:status = 'PARTIALLY_OCCUPIED' AND SIZE(r.users) > 0 AND SIZE(r.users) < r.capacity) OR " +
            "(:status = 'FULL' AND SIZE(r.users) >= r.capacity)) AND " +
            "(:search IS NULL OR :search = '' OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Room> findByFilters(@Param("buildingId") Long buildingId,
                               @Param("status") String status,
                               @Param("search") String search,
                               Pageable pageable);

    @Query("SELECT COUNT(r) FROM Room r WHERE SIZE(r.users) > 0")
    Long countOccupiedRooms();

    @Query("SELECT COUNT(r) FROM Room r WHERE SIZE(r.users) = 0")
    Long countAvailableRooms();

    // count rooms by room standard id
    @Query("SELECT COUNT(r) FROM Room r WHERE r.roomStandard.id = :standardId")
    long countByRoomStandardId(@Param("standardId") Long standardId);
    
    // find rooms by room standard id
    @Query("SELECT r FROM Room r WHERE r.roomStandard.id = :standardId")
    java.util.List<Room> findByRoomStandardId(@Param("standardId") Long standardId);
}
