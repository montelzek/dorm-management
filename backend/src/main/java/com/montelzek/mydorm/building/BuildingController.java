package com.montelzek.mydorm.building;

import com.montelzek.mydorm.building.payload.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class BuildingController {

    private final BuildingRepository buildingRepository;
    private final BuildingService buildingService;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<Building> allBuildings() {
        return buildingRepository.findAll();
    }

    // Admin endpoints
    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public BuildingsPagePayload adminBuildings(
            @Argument Integer page,
            @Argument Integer size) {
        return buildingService.getAllBuildings(page, size);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public BuildingDetailsPayload buildingDetails(@Argument Long id) {
        return buildingService.getBuildingDetails(id);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminBuildingPayload createBuilding(@Argument @Valid CreateBuildingInput input) {
        return buildingService.createBuilding(input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminBuildingPayload updateBuilding(
            @Argument Long id,
            @Argument @Valid UpdateBuildingInput input) {
        return buildingService.updateBuilding(id, input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteBuilding(@Argument Long id) {
        return buildingService.deleteBuilding(id);
    }
}
