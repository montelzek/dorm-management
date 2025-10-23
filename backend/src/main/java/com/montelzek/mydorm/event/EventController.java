package com.montelzek.mydorm.event;

import com.montelzek.mydorm.event.payload.*;
import com.montelzek.mydorm.user.User;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class EventController {

    private final EventService eventService;

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EventsPagePayload adminEvents(
            @Argument Integer page,
            @Argument Integer size,
            @Argument Long buildingId,
            @Argument String startDate,
            @Argument String endDate
    ) {
        return eventService.getEvents(page, size, buildingId, startDate, endDate);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<EventPayload> residentEvents(
            @Argument String startDate,
            @Argument String endDate,
            @AuthenticationPrincipal User user
    ) {
        return eventService.getEventsByDateRange(startDate, endDate);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EventPayload createEvent(
            @Argument CreateEventInput input,
            @AuthenticationPrincipal User user
    ) {
        return eventService.createEvent(input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public EventPayload updateEvent(
            @Argument Long id,
            @Argument UpdateEventInput input,
            @AuthenticationPrincipal User user
    ) {
        return eventService.updateEvent(id, input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteEvent(
            @Argument Long id,
            @AuthenticationPrincipal User user
    ) {
        return eventService.deleteEvent(id);
    }
}

