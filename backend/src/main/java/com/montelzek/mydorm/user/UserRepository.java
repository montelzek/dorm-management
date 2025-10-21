package com.montelzek.mydorm.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = 'ROLE_RESIDENT'")
    List<User> findAllResidents();

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = 'ROLE_RESIDENT'")
    Page<User> findAllResidents(Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = 'ROLE_RESIDENT' AND u.room.building.id = :buildingId")
    List<User> findResidentsByBuildingId(@Param("buildingId") Long buildingId);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = 'ROLE_RESIDENT' AND u.room.building.id = :buildingId")
    Page<User> findResidentsByBuildingId(@Param("buildingId") Long buildingId, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r LEFT JOIN u.room room WHERE r = 'ROLE_RESIDENT' AND (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(room.roomNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findAllResidentsWithSearch(@Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r LEFT JOIN u.room room WHERE r = 'ROLE_RESIDENT' AND u.room.building.id = :buildingId AND (LOWER(u.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(room.roomNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> findResidentsByBuildingIdWithSearch(@Param("buildingId") Long buildingId, @Param("search") String search, Pageable pageable);
}
