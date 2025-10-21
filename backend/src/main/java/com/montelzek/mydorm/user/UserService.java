package com.montelzek.mydorm.user;

import com.montelzek.mydorm.reservation.payload.GraphQLPayloads;
import com.montelzek.mydorm.user.payloads.ResidentPayload;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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

}
