package com.montelzek.mydorm.user;

import com.montelzek.mydorm.constants.ApplicationConstants;
import com.montelzek.mydorm.exception.BusinessException;
import com.montelzek.mydorm.exception.ErrorCodes;
import com.montelzek.mydorm.reservation.ReservationRepository;
import com.montelzek.mydorm.reservation.payload.GraphQLPayloads;
import com.montelzek.mydorm.room.Room;
import com.montelzek.mydorm.room.RoomRepository;
import com.montelzek.mydorm.user.payloads.ResidentPage;
import com.montelzek.mydorm.user.payloads.ResidentPayload;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public List<ResidentPayload> getResidentsAsPayloads() {
        return userRepository.findAllResidents().stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    public List<ResidentPayload> getResidentsByBuilding(Long buildingId) {
        return userRepository.findResidentsByBuildingId(buildingId).stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    public ResidentPage getResidentsPage(Integer page, Integer size, String search, String sortBy, String sortDirection) {
        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 10;
        
        // Default sort by firstName ascending if not specified
        String sortField = sortBy != null && !sortBy.trim().isEmpty() ? sortBy : "firstName";
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> userPage;

        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.findAllResidentsWithSearch(search.trim(), pageable);
        } else {
            userPage = userRepository.findAllResidents(pageable);
        }

        List<ResidentPayload> content = userPage.getContent().stream()
                .map(this::toPayload)
                .collect(Collectors.toList());

        return new ResidentPage(
                content,
                (int) userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.getNumber(),
                userPage.getSize()
        );
    }

    public ResidentPage getResidentsByBuildingPage(Long buildingId, Integer page, Integer size, String search, String sortBy, String sortDirection) {
        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 10;
        
        // Default sort by firstName ascending if not specified
        String sortField = sortBy != null && !sortBy.trim().isEmpty() ? sortBy : "firstName";
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> userPage;

        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.findResidentsByBuildingIdWithSearch(buildingId, search.trim(), pageable);
        } else {
            userPage = userRepository.findResidentsByBuildingId(buildingId, pageable);
        }

        List<ResidentPayload> content = userPage.getContent().stream()
                .map(this::toPayload)
                .collect(Collectors.toList());

        return new ResidentPage(
                content,
                (int) userPage.getTotalElements(),
                userPage.getTotalPages(),
                userPage.getNumber(),
                userPage.getSize()
        );
    }

    public ResidentPayload toPayload(User user) {
        String buildingName = user.getRoom() != null && user.getRoom().getBuilding() != null
                ? user.getRoom().getBuilding().getName()
                : "N/A";
        
        Long buildingId = user.getRoom() != null && user.getRoom().getBuilding() != null
                ? user.getRoom().getBuilding().getId()
                : null;
        
        String roomNumber = user.getRoom() != null
                ? user.getRoom().getRoomNumber()
                : "N/A";
        
        Long roomId = user.getRoom() != null
                ? user.getRoom().getId()
                : null;

        return new ResidentPayload(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                buildingName,
                buildingId,
                roomNumber,
                roomId
        );
    }

    public ResidentPayload assignRoom(Long userId, Long roomId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCodes.RESOURCE_NOT_FOUND,
                        "User not found with id: " + userId,
                        "userId"
                ));

        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCodes.RESOURCE_NOT_FOUND,
                        "Room not found with id: " + roomId,
                        "roomId"
                ));

        // Check if room has available capacity
        if (room.getUsers().size() >= room.getCapacity()) {
            throw new BusinessException(
                    ErrorCodes.VALIDATION_ERROR,
                    "Room is at full capacity",
                    "roomId"
            );
        }

        user.setRoom(room);
        User savedUser = userRepository.save(user);

        return toPayload(savedUser);
    }

    public boolean deleteResident(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCodes.RESOURCE_NOT_FOUND,
                        "User not found with id: " + userId,
                        "userId"
                ));

        // Check if user has active reservations
        ZoneId dormitoryZone = ApplicationConstants.DORMITORY_TIMEZONE;
        LocalDateTime now = LocalDateTime.now(dormitoryZone);
        
        boolean hasActiveReservations = reservationRepository.hasActiveReservations(userId, now);
        if (hasActiveReservations) {
            throw new BusinessException(
                    ErrorCodes.VALIDATION_ERROR,
                    "Cannot delete resident with active reservations",
                    "userId"
            );
        }

        userRepository.delete(user);
        return true;
    }

}
