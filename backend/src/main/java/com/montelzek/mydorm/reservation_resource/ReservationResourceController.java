package com.montelzek.mydorm.reservation_resource;

import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class ReservationResourceController {

    private final ReservationResourceRepository resourceRepository;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<ReservationResource> resourcesByBuilding(@Argument Long buildingId) {
        return resourceRepository.findByBuildingId(buildingId);
    }
}
