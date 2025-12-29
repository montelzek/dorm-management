package com.montelzek.mydorm.room;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomStandardRepository extends JpaRepository<RoomStandard, Long> {
}

