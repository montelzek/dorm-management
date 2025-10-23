package com.montelzek.mydorm.reservation_resource;

import com.montelzek.mydorm.building.Building;
import com.montelzek.mydorm.building.BuildingRepository;
import com.montelzek.mydorm.reservation_resource.payload.*;
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
public class ReservationResourceService {

    private final ReservationResourceRepository resourceRepository;
    private final BuildingRepository buildingRepository;
    
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public ResourcesPagePayload getAllResources(Integer page, Integer size, Long buildingId, Boolean isActive) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "name"));
        Page<ReservationResource> resourcesPage = resourceRepository.findByFilters(buildingId, isActive, pageable);
        
        List<AdminResourcePayload> content = resourcesPage.getContent().stream()
                .map(this::toAdminPayload)
                .collect(Collectors.toList());
        
        return new ResourcesPagePayload(
                content,
                (int) resourcesPage.getTotalElements(),
                resourcesPage.getTotalPages(),
                resourcesPage.getNumber(),
                resourcesPage.getSize()
        );
    }

    @Transactional
    public AdminResourcePayload createResource(CreateResourceInput input) {
        Building building = buildingRepository.findById(input.buildingId())
                .orElseThrow(() -> new IllegalArgumentException("Building not found with id: " + input.buildingId()));
        
        // Check if resource with same name exists in this building
        List<ReservationResource> existingResources = resourceRepository.findByBuildingId(input.buildingId());
        boolean nameExists = existingResources.stream()
                .anyMatch(r -> r.getName().equalsIgnoreCase(input.name()));
        
        if (nameExists) {
            throw new IllegalStateException(
                "A common space with name '" + input.name() + "' already exists in building '" + building.getName() + "'"
            );
        }
        
        ReservationResource resource = new ReservationResource();
        resource.setName(input.name());
        resource.setDescription(input.description());
        resource.setBuilding(building);
        resource.setActive(input.isActive());
        resource.setResourceType(EResourceType.STANDARD); // Default type
        
        ReservationResource saved = resourceRepository.save(resource);
        return toAdminPayload(saved);
    }

    @Transactional
    public AdminResourcePayload updateResource(Long id, UpdateResourceInput input) {
        ReservationResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));
        
        Building building = buildingRepository.findById(input.buildingId())
                .orElseThrow(() -> new IllegalArgumentException("Building not found with id: " + input.buildingId()));
        
        // Check if another resource with same name exists in the target building
        List<ReservationResource> existingResources = resourceRepository.findByBuildingId(input.buildingId());
        boolean nameExists = existingResources.stream()
                .filter(r -> !r.getId().equals(id))
                .anyMatch(r -> r.getName().equalsIgnoreCase(input.name()));
        
        if (nameExists) {
            throw new IllegalStateException(
                "A common space with name '" + input.name() + "' already exists in building '" + building.getName() + "'"
            );
        }
        
        resource.setName(input.name());
        resource.setDescription(input.description());
        resource.setBuilding(building);
        resource.setActive(input.isActive());
        
        ReservationResource updated = resourceRepository.save(resource);
        return toAdminPayload(updated);
    }

    @Transactional
    public AdminResourcePayload toggleResourceStatus(Long id) {
        ReservationResource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with id: " + id));
        
        resource.setActive(!resource.isActive());
        ReservationResource updated = resourceRepository.save(resource);
        
        return toAdminPayload(updated);
    }

    private AdminResourcePayload toAdminPayload(ReservationResource resource) {
        return new AdminResourcePayload(
                resource.getId(),
                resource.getName(),
                resource.getDescription(),
                resource.getResourceType().name(),
                resource.getBuilding().getId(),
                resource.getBuilding().getName(),
                resource.isActive(),
                resource.getCreatedAt().format(DATE_TIME_FORMATTER)
        );
    }
}

