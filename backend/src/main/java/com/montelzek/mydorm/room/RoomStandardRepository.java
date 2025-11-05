package com.montelzek.mydorm.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomStandardRepository extends JpaRepository<RoomStandard, Long> {
    List<RoomStandard> findByName(String name);
}

