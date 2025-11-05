package com.montelzek.mydorm.room;

import com.montelzek.mydorm.building.Building;
import com.montelzek.mydorm.building.BuildingRepository;
import com.montelzek.mydorm.room.payload.*;
import com.montelzek.mydorm.room.payloads.RoomPayload;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final BuildingRepository buildingRepository;
    private final RoomStandardRepository roomStandardRepository;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public RoomsPagePayload getAllRooms(Integer page, Integer size, Long buildingId, String status) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "roomNumber"));
        Page<Room> roomsPage = roomRepository.findByFilters(buildingId, status, pageable);

        List<AdminRoomPayload> content = roomsPage.getContent().stream()
                .map(this::toAdminPayload)
                .collect(Collectors.toList());

        return new RoomsPagePayload(
                content,
                (int) roomsPage.getTotalElements(),
                roomsPage.getTotalPages(),
                roomsPage.getNumber(),
                roomsPage.getSize()
        );
    }

    @Transactional
    public AdminRoomPayload createRoom(CreateRoomInput input) {
        Building building = buildingRepository.findById(input.buildingId())
                .orElseThrow(() -> new IllegalArgumentException("Building not found with id: " + input.buildingId()));

        if (input.capacity() < 1) {
            throw new IllegalArgumentException("Room capacity must be at least 1");
        }

        RoomStandard standard = roomStandardRepository.findById(input.standardId())
                .orElseThrow(() -> new IllegalArgumentException("Room standard not found with id: " + input.standardId()));

        if (!standard.getCapacity().equals(input.capacity())) {
            throw new IllegalStateException("Selected standard capacity does not match room capacity.");
        }

        Room room = new Room();
        room.setRoomNumber(input.roomNumber());
        room.setBuilding(building);
        room.setCapacity(input.capacity());
        room.setRoomStandard(standard);

        Room saved = roomRepository.save(room);
        return toAdminPayload(saved);
    }

    @Transactional
    public AdminRoomPayload updateRoom(Long id, UpdateRoomInput input) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room not found with id: " + id));

        Building building = buildingRepository.findById(input.buildingId())
                .orElseThrow(() -> new IllegalArgumentException("Building not found with id: " + input.buildingId()));

        int currentOccupancy = room.getUsers().size();
        if (input.capacity() < currentOccupancy) {
            throw new IllegalStateException(
                "Cannot reduce capacity below current occupancy. Current occupancy: " +
                currentOccupancy + ", requested capacity: " + input.capacity()
            );
        }

        RoomStandard standard = roomStandardRepository.findById(input.standardId())
                .orElseThrow(() -> new IllegalArgumentException("Room standard not found with id: " + input.standardId()));

        if (!standard.getCapacity().equals(input.capacity())) {
            throw new IllegalStateException("Selected standard capacity does not match room capacity.");
        }

        room.setRoomNumber(input.roomNumber());
        room.setBuilding(building);
        room.setCapacity(input.capacity());
        room.setRoomStandard(standard);

        Room updated = roomRepository.save(room);
        return toAdminPayload(updated);
    }

    @Transactional
    public Boolean deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new IllegalArgumentException("Room not found with id: " + id);
        }

        Room room = roomRepository.findById(id).get();

        if (!room.getUsers().isEmpty()) {
            throw new IllegalStateException(
                "Cannot delete room. It has " + room.getUsers().size() +
                " resident(s) assigned. Please reassign them first."
            );
        }

        try {
            roomRepository.deleteById(id);
            roomRepository.flush();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete room: " + e.getMessage(), e);
        }

        return true;
    }

    @Transactional
    public List<RoomPayload> getAvailableRooms(Long buildingId) {
        List<Room> rooms;
        if (buildingId != null) {
            Building building = buildingRepository.findById(buildingId)
                    .orElseThrow(() -> new IllegalArgumentException("Building not found with id: " + buildingId));
            rooms = building.getRooms().stream()
                    .filter(room -> room.getUsers().size() < room.getCapacity())
                    .toList();
        } else {
            rooms = roomRepository.findAll().stream()
                    .filter(room -> room.getUsers().size() < room.getCapacity())
                    .toList();
        }

        return rooms.stream()
                .map(this::toRoomPayload)
                .collect(Collectors.toList());
    }

    private RoomPayload toRoomPayload(Room room) {
        Long standardId = null;
        String standardName = null;
        Integer standardCapacity = null;
        java.math.BigDecimal standardPrice = null;
        if (room.getRoomStandard() != null) {
            standardId = room.getRoomStandard().getId();
            standardName = room.getRoomStandard().getName();
            standardCapacity = room.getRoomStandard().getCapacity();
            standardPrice = room.getRoomStandard().getPrice();
        }

        return new RoomPayload(
                room.getId(),
                room.getRoomNumber(),
                room.getCapacity(),
                room.getUsers().size(),
                standardId,
                standardName,
                standardCapacity,
                standardPrice,
                room.getBuilding().getId(),
                room.getBuilding().getName()
        );
    }

    private AdminRoomPayload toAdminPayload(Room room) {
        Long standardId = null;
        String standardName = null;
        int standardCapacity = 0;
        String standardPrice = null;
        if (room.getRoomStandard() != null) {
            standardId = room.getRoomStandard().getId();
            standardName = room.getRoomStandard().getName();
            standardCapacity = room.getRoomStandard().getCapacity();
            standardPrice = room.getRoomStandard().getPrice().toString();
        }
        return new AdminRoomPayload(
                room.getId(),
                room.getRoomNumber(),
                room.getBuilding().getId(),
                room.getBuilding().getName(),
                room.getCapacity(),
                room.getUsers().size(),
                standardId,
                standardName,
                standardCapacity,
                standardPrice,
                room.getCreatedAt().format(DATE_TIME_FORMATTER)
        );
    }
}
