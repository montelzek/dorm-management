package com.montelzek.mydorm.event;

import com.montelzek.mydorm.building.Building;
import com.montelzek.mydorm.building.BuildingRepository;
import com.montelzek.mydorm.event.payload.*;
import com.montelzek.mydorm.reservation_resource.ReservationResource;
import com.montelzek.mydorm.reservation_resource.ReservationResourceRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final BuildingRepository buildingRepository;
    private final ReservationResourceRepository resourceRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public EventPayload createEvent(CreateEventInput input) {
        Event event = new Event();
        event.setTitle(input.title());
        event.setDescription(input.description());
        event.setEventDate(LocalDate.parse(input.eventDate(), DATE_FORMATTER));
        event.setStartTime(LocalTime.parse(input.startTime(), TIME_FORMATTER));
        event.setEndTime(LocalTime.parse(input.endTime(), TIME_FORMATTER));

        if (input.buildingId() != null) {
            Building building = buildingRepository.findById(input.buildingId())
                    .orElseThrow(() -> new IllegalArgumentException("Building not found: " + input.buildingId()));
            event.setBuilding(building);
        }

        if (input.resourceId() != null) {
            ReservationResource resource = resourceRepository.findById(input.resourceId())
                    .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + input.resourceId()));
            event.setResource(resource);
        }

        Event savedEvent = eventRepository.save(event);
        return toPayload(savedEvent);
    }

    @Transactional
    public EventPayload updateEvent(Long id, UpdateEventInput input) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));

        event.setTitle(input.title());
        event.setDescription(input.description());
        event.setEventDate(LocalDate.parse(input.eventDate(), DATE_FORMATTER));
        event.setStartTime(LocalTime.parse(input.startTime(), TIME_FORMATTER));
        event.setEndTime(LocalTime.parse(input.endTime(), TIME_FORMATTER));

        if (input.buildingId() != null) {
            Building building = buildingRepository.findById(input.buildingId())
                    .orElseThrow(() -> new IllegalArgumentException("Building not found: " + input.buildingId()));
            event.setBuilding(building);
        } else {
            event.setBuilding(null);
        }

        if (input.resourceId() != null) {
            ReservationResource resource = resourceRepository.findById(input.resourceId())
                    .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + input.resourceId()));
            event.setResource(resource);
        } else {
            event.setResource(null);
        }

        Event updatedEvent = eventRepository.save(event);
        return toPayload(updatedEvent);
    }

    @Transactional
    public boolean deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found: " + id));
        eventRepository.delete(event);
        return true;
    }

    public EventsPagePayload getEvents(Integer page, Integer size, Long buildingId, String startDate, String endDate) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 20;

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.ASC, "eventDate", "startTime"));

        LocalDate start = startDate != null ? LocalDate.parse(startDate, DATE_FORMATTER) : null;
        LocalDate end = endDate != null ? LocalDate.parse(endDate, DATE_FORMATTER) : null;

        Page<Event> eventsPage = eventRepository.findByFilters(start, end, buildingId, pageable);

        List<EventPayload> content = eventsPage.getContent().stream()
                .map(this::toPayload)
                .collect(Collectors.toList());

        return new EventsPagePayload(
                content,
                (int) eventsPage.getTotalElements(),
                eventsPage.getTotalPages(),
                eventsPage.getNumber(),
                eventsPage.getSize()
        );
    }

    public List<EventPayload> getEventsByDateRange(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate, DATE_FORMATTER);
        LocalDate end = LocalDate.parse(endDate, DATE_FORMATTER);

        List<Event> events = eventRepository.findByDateRange(start, end);

        return events.stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    public EventPayload toPayload(Event event) {
        EventBuildingPayload buildingPayload = null;
        if (event.getBuilding() != null) {
            buildingPayload = new EventBuildingPayload(
                    event.getBuilding().getId(),
                    event.getBuilding().getName()
            );
        }

        EventResourcePayload resourcePayload = null;
        if (event.getResource() != null) {
            resourcePayload = new EventResourcePayload(
                    event.getResource().getId(),
                    event.getResource().getName()
            );
        }

        return new EventPayload(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate().format(DATE_FORMATTER),
                event.getStartTime().format(TIME_FORMATTER),
                event.getEndTime().format(TIME_FORMATTER),
                buildingPayload,
                resourcePayload,
                event.getCreatedAt().format(DATE_TIME_FORMATTER),
                event.getUpdatedAt().format(DATE_TIME_FORMATTER)
        );
    }
}

