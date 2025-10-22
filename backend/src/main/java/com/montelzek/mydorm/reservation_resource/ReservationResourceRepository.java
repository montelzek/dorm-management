package com.montelzek.mydorm.reservation_resource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationResourceRepository extends JpaRepository<ReservationResource, Long> {

    List<ReservationResource> findByBuildingId(Long buildingId);
    
    List<ReservationResource> findByBuildingIdAndIsActive(Long buildingId, boolean isActive);
    
    @Query("SELECT DISTINCT r FROM ReservationResource r " +
            "LEFT JOIN r.building b " +
            "WHERE (:buildingId IS NULL OR r.building.id = :buildingId) AND " +
            "(:isActive IS NULL OR r.isActive = :isActive)")
    Page<ReservationResource> findByFilters(@Param("buildingId") Long buildingId,
                                             @Param("isActive") Boolean isActive,
                                             Pageable pageable);
}
