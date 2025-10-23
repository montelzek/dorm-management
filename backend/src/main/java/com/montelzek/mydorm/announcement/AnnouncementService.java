package com.montelzek.mydorm.announcement;

import com.montelzek.mydorm.announcement.payload.*;
import com.montelzek.mydorm.building.Building;
import com.montelzek.mydorm.building.BuildingRepository;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final BuildingRepository buildingRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public AnnouncementsPagePayload getAllAnnouncements(Integer page, Integer size) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;

        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "startDate"));
        Page<Announcement> announcementsPage = announcementRepository.findAllWithBuildings(pageable);

        List<AnnouncementPayload> content = announcementsPage.getContent().stream()
                .map(this::toPayload)
                .collect(Collectors.toList());

        return new AnnouncementsPagePayload(
                content,
                (int) announcementsPage.getTotalElements(),
                announcementsPage.getTotalPages(),
                announcementsPage.getNumber()
        );
    }

    @Transactional
    public List<AnnouncementPayload> getActiveAnnouncementsForResident(Long userId) {
        try {
            System.out.println("=== getActiveAnnouncementsForResident called for userId: " + userId);
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

            System.out.println("User found: " + user.getFirstName() + " " + user.getLastName());
            
            List<Long> buildingIds = new ArrayList<>();
            if (user.getRoom() != null && user.getRoom().getBuilding() != null) {
                buildingIds.add(user.getRoom().getBuilding().getId());
                System.out.println("User building ID: " + user.getRoom().getBuilding().getId());
            } else {
                System.out.println("User has no room or building assigned");
            }

            // If user has no building, return only global announcements
            List<Announcement> announcements;
            if (buildingIds.isEmpty()) {
                System.out.println("Fetching global announcements only");
                announcements = announcementRepository.findActiveGlobalAnnouncements();
            } else {
                System.out.println("Fetching announcements for building IDs: " + buildingIds);
                announcements = announcementRepository.findActiveAnnouncementsForBuildings(buildingIds);
            }
            
            System.out.println("Found " + (announcements != null ? announcements.size() : "null") + " announcements");
            
            // Ensure we always return a list, never null
            if (announcements == null) {
                announcements = new ArrayList<>();
            }

            List<AnnouncementPayload> result = announcements.stream()
                    .map(this::toPayload)
                    .collect(Collectors.toList());
            
            System.out.println("Returning " + result.size() + " announcement payloads");
            return result;
        } catch (Exception e) {
            System.err.println("ERROR in getActiveAnnouncementsForResident: " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing to prevent GraphQL null error
            return new ArrayList<>();
        }
    }

    @Transactional
    public AnnouncementPayload createAnnouncement(CreateAnnouncementInput input) {
        Announcement announcement = new Announcement();
        announcement.setTitle(input.title());
        announcement.setContent(input.content());
        announcement.setCategory(EAnnouncementCategory.valueOf(input.category()));
        announcement.setStartDate(input.startDate());
        announcement.setEndDate(input.endDate());

        Set<Building> buildings = new HashSet<>();
        if (input.buildingIds() != null && !input.buildingIds().isEmpty()) {
            for (Long buildingId : input.buildingIds()) {
                Building building = buildingRepository.findById(buildingId)
                        .orElseThrow(() -> new IllegalArgumentException("Building not found: " + buildingId));
                buildings.add(building);
            }
        }
        announcement.setBuildings(buildings);

        Announcement savedAnnouncement = announcementRepository.save(announcement);
        return toPayload(savedAnnouncement);
    }

    @Transactional
    public AnnouncementPayload updateAnnouncement(Long id, UpdateAnnouncementInput input) {
        Announcement announcement = announcementRepository.findByIdWithBuildings(id)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found: " + id));

        announcement.setTitle(input.title());
        announcement.setContent(input.content());
        announcement.setCategory(EAnnouncementCategory.valueOf(input.category()));
        announcement.setStartDate(input.startDate());
        announcement.setEndDate(input.endDate());

        announcement.getBuildings().clear();
        Set<Building> buildings = new HashSet<>();
        if (input.buildingIds() != null && !input.buildingIds().isEmpty()) {
            for (Long buildingId : input.buildingIds()) {
                Building building = buildingRepository.findById(buildingId)
                        .orElseThrow(() -> new IllegalArgumentException("Building not found: " + buildingId));
                buildings.add(building);
            }
        }
        announcement.setBuildings(buildings);

        Announcement updatedAnnouncement = announcementRepository.save(announcement);
        return toPayload(updatedAnnouncement);
    }

    @Transactional
    public Boolean deleteAnnouncement(Long id) {
        if (!announcementRepository.existsById(id)) {
            throw new IllegalArgumentException("Announcement not found: " + id);
        }
        announcementRepository.deleteById(id);
        return true;
    }

    private AnnouncementPayload toPayload(Announcement announcement) {
        List<AnnouncementBuildingPayload> buildingPayloads = announcement.getBuildings().stream()
                .map(building -> new AnnouncementBuildingPayload(building.getId(), building.getName()))
                .collect(Collectors.toList());

        return new AnnouncementPayload(
                announcement.getId(),
                announcement.getTitle(),
                announcement.getContent(),
                announcement.getCategory().name(),
                announcement.getStartDate(),
                announcement.getEndDate(),
                buildingPayloads,
                announcement.getCreatedAt(),
                announcement.getUpdatedAt()
        );
    }
}

