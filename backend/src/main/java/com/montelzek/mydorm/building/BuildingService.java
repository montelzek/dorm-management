package com.montelzek.mydorm.building;

import com.montelzek.mydorm.building.payload.*;
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
public class BuildingService {

    private final BuildingRepository buildingRepository;
    
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public BuildingsPagePayload getAllBuildings(Integer page, Integer size) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "name"));
        Page<Building> buildingsPage = buildingRepository.findAll(pageable);
        
        List<AdminBuildingPayload> content = buildingsPage.getContent().stream()
                .map(this::toAdminPayload)
                .collect(Collectors.toList());
        
        return new BuildingsPagePayload(
                content,
                (int) buildingsPage.getTotalElements(),
                buildingsPage.getTotalPages(),
                buildingsPage.getNumber(),
                buildingsPage.getSize()
        );
    }

    @Transactional
    public BuildingDetailsPayload getBuildingDetails(Long id) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Building not found with id: " + id));
        
        return new BuildingDetailsPayload(
                building.getId(),
                building.getName(),
                building.getAddress(),
                building.getRooms().size(),
                building.getReservationResources().size(),
                building.getCreatedAt().format(DATE_TIME_FORMATTER),
                building.getUpdatedAt().format(DATE_TIME_FORMATTER)
        );
    }

    @Transactional
    public AdminBuildingPayload createBuilding(CreateBuildingInput input) {
        // Check if building with same name already exists
        if (buildingRepository.findByName(input.name()).isPresent()) {
            throw new IllegalStateException("Building with name '" + input.name() + "' already exists");
        }
        
        Building building = new Building();
        building.setName(input.name());
        building.setAddress(input.address());
        
        Building saved = buildingRepository.save(building);
        return toAdminPayload(saved);
    }

    @Transactional
    public AdminBuildingPayload updateBuilding(Long id, UpdateBuildingInput input) {
        Building building = buildingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Building not found with id: " + id));
        
        // Check if another building with same name exists
        buildingRepository.findByName(input.name()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new IllegalStateException("Building with name '" + input.name() + "' already exists");
            }
        });
        
        building.setName(input.name());
        building.setAddress(input.address());
        
        Building updated = buildingRepository.save(building);
        return toAdminPayload(updated);
    }

    @Transactional
    public Boolean deleteBuilding(Long id) {
        if (!buildingRepository.existsById(id)) {
            throw new IllegalArgumentException("Building not found with id: " + id);
        }
        
        Building building = buildingRepository.findById(id).get();
        
        int roomsCount = building.getRooms().size();
        int resourcesCount = building.getReservationResources().size();
        
        if (roomsCount > 0 || resourcesCount > 0) {
            throw new IllegalStateException(
                "Cannot delete building. It contains " + roomsCount + " room(s) and " + 
                resourcesCount + " common space(s). Please delete or reassign them first."
            );
        }
        
        try {
            buildingRepository.deleteById(id);
            buildingRepository.flush();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete building: " + e.getMessage(), e);
        }
        
        return true;
    }

    private AdminBuildingPayload toAdminPayload(Building building) {
        return new AdminBuildingPayload(
                building.getId(),
                building.getName(),
                building.getAddress(),
                building.getRooms().size(),
                building.getReservationResources().size(),
                building.getCreatedAt().format(DATE_TIME_FORMATTER)
        );
    }
}

