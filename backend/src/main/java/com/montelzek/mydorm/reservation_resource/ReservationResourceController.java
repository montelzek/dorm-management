package com.montelzek.mydorm.reservation_resource;

import com.montelzek.mydorm.reservation_resource.payload.*;
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
public class ReservationResourceController {

    private final ReservationResourceRepository reservationResourceRepository;
    private final ReservationResourceService reservationResourceService;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<ReservationResource> resourcesByBuilding(@Argument Long buildingId) {
        return reservationResourceRepository.findByBuildingId(buildingId);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResourcesPagePayload adminReservationResources(
            @Argument Integer page,
            @Argument Integer size,
            @Argument Long buildingId,
            @Argument Boolean isActive) {
        return reservationResourceService.getAllResources(page, size, buildingId, isActive);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminResourcePayload createReservationResource(@Argument @Valid CreateResourceInput input) {
        return reservationResourceService.createResource(input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminResourcePayload updateReservationResource(
            @Argument Long id,
            @Argument @Valid UpdateResourceInput input) {
        return reservationResourceService.updateResource(id, input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminResourcePayload toggleResourceStatus(@Argument Long id) {
        return reservationResourceService.toggleResourceStatus(id);
    }
}
