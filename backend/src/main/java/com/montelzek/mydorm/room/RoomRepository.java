package com.montelzek.mydorm.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT r FROM Room r WHERE r.building.id = :buildingId AND SIZE(r.users) < r.capacity")
    List<Room> findAvailableRoomsByBuildingId(@Param("buildingId") Long buildingId);

    @Query("SELECT r FROM Room r WHERE SIZE(r.users) < r.capacity")
    List<Room> findAllAvailableRooms();
}

