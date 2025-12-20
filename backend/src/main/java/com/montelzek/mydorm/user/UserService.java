package com.montelzek.mydorm.user;

import com.montelzek.mydorm.exception.BusinessException;
import com.montelzek.mydorm.exception.ErrorCodes;
import com.montelzek.mydorm.room.Room;
import com.montelzek.mydorm.room.RoomRepository;
import com.montelzek.mydorm.user.payloads.ResidentPage;
import com.montelzek.mydorm.user.payloads.ResidentPayload;
import com.montelzek.mydorm.user.payloads.UpdateProfileInput;
import com.montelzek.mydorm.user.payloads.UserProfilePayload;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public List<ResidentPayload> getResidentsAsPayloads() {
        return userRepository.findAllResidents().stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    public ResidentPayload createResident(com.montelzek.mydorm.user.payloads.CreateResidentInput input) {
        userRepository.findByEmail(input.email()).ifPresent(u -> {
            throw new BusinessException(ErrorCodes.VALIDATION_ERROR, "Email already exists", "email");
        });

        User user = new User();
        user.setFirstName(input.firstName());
        user.setLastName(input.lastName());
        user.setEmail(input.email());
        user.setPhone(input.phone());
        user.setPassword(passwordEncoder.encode(input.password()));
        
        user.setRoles(java.util.Collections.singleton(ERole.ROLE_RESIDENT));

        if (input.roomId() != null) {
            Room room = roomRepository.findById(Long.valueOf(input.roomId()))
                    .orElseThrow(() -> new BusinessException(ErrorCodes.RESOURCE_NOT_FOUND, "Room not found", "roomId"));
            
            if (room.getUsers().size() >= room.getCapacity()) {
                throw new BusinessException(ErrorCodes.VALIDATION_ERROR, "Room is at full capacity", "roomId");
            }
            user.setRoom(room);
        }

        User savedUser = userRepository.save(user);
        return toPayload(savedUser);
    }

    public ResidentPayload createTechnician(com.montelzek.mydorm.user.payloads.CreateTechnicianInput input) {
        userRepository.findByEmail(input.email()).ifPresent(u -> {
            throw new BusinessException(ErrorCodes.VALIDATION_ERROR, "Email already exists", "email");
        });

        User user = new User();
        user.setFirstName(input.firstName());
        user.setLastName(input.lastName());
        user.setEmail(input.email());
        user.setPhone(input.phone());
        user.setPassword(passwordEncoder.encode(input.password()));
        
        user.setRoles(java.util.Collections.singleton(ERole.ROLE_TECHNICIAN));

        User savedUser = userRepository.save(user);
        return toPayload(savedUser);
    }



    public List<ResidentPayload> getResidentsByBuilding(Long buildingId) {
        return userRepository.findResidentsByBuildingId(buildingId).stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    public ResidentPage getResidentsPage(Integer page, Integer size, String search, String sortBy, String sortDirection) {
        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 10;
        
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

    public ResidentPage getTechniciansPage(Integer page, Integer size, String search, String sortBy, String sortDirection) {
        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 10;
        
        String sortField = sortBy != null && !sortBy.trim().isEmpty() ? sortBy : "firstName";
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortField);

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> userPage;

        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.findAllTechniciansWithSearch(search.trim(), pageable);
        } else {
            userPage = userRepository.findAllTechnicians(pageable);
        }

        List<ResidentPayload> content = userPage.getContent().stream()
                .map(this::toPayload)
                .collect(Collectors.toList());

        // Reusing ResidentPage for now as it has the same structure
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

        userRepository.delete(user);
        return true;
    }

    public boolean deleteTechnician(Long userId) {
        return deleteResident(userId); // Reusing deletion logic
    }

    public UserProfilePayload updateMyProfile(Long userId, UpdateProfileInput input) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(
                        ErrorCodes.RESOURCE_NOT_FOUND,
                        "User not found with id: " + userId,
                        "userId"
                ));

        if (!user.getEmail().equals(input.email())) {
            userRepository.findByEmail(input.email()).ifPresent(existingUser -> {
                if (!existingUser.getId().equals(userId)) {
                    throw new BusinessException(
                            ErrorCodes.VALIDATION_ERROR,
                            "Email is already taken",
                            "email"
                    );
                }
            });
        }

        user.setFirstName(input.firstName());
        user.setLastName(input.lastName());
        user.setEmail(input.email());
        user.setPhone(input.phone());

        User savedUser = userRepository.save(user);

        return new UserProfilePayload(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getPhone()
        );
    }

}
