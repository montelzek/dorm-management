package com.montelzek.mydorm.room;

import com.montelzek.mydorm.room.payloads.RoomPayload;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomPayload> getAvailableRooms(Long buildingId) {
        List<Room> rooms;
        if (buildingId != null) {
            rooms = roomRepository.findAvailableRoomsByBuildingId(buildingId);
        } else {
            rooms = roomRepository.findAllAvailableRooms();
        }

        return rooms.stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    private RoomPayload toPayload(Room room) {
        return new RoomPayload(
                room.getId(),
                room.getRoomNumber(),
                room.getCapacity(),
                room.getUsers().size(),
                room.getRentAmount(),
                room.getBuilding().getId(),
                room.getBuilding().getName()
        );
    }
}

