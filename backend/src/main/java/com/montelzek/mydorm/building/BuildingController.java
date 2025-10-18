package com.montelzek.mydorm.building;

import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class BuildingController {

    private final BuildingRepository buildingRepository;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<Building> allBuildings() {
        return buildingRepository.findAll();
    }
}
