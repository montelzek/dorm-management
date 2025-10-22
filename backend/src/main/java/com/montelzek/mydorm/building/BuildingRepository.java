package com.montelzek.mydorm.building;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuildingRepository extends JpaRepository<Building, Long> {
    
    Optional<Building> findByName(String name);
}
