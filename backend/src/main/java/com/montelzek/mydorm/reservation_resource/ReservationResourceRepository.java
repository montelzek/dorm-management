package com.montelzek.mydorm.reservation_resource;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationResourceRepository extends JpaRepository<ReservationResource, Long> {

    List<ReservationResource> findByBuildingId(Long buildingId);
}
