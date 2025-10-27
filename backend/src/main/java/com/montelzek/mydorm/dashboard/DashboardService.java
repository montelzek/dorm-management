package com.montelzek.mydorm.dashboard;

import com.montelzek.mydorm.announcement.AnnouncementService;
import com.montelzek.mydorm.announcement.payload.AnnouncementPayload;
import com.montelzek.mydorm.building.BuildingRepository;
import com.montelzek.mydorm.dashboard.payload.*;
import com.montelzek.mydorm.event.Event;
import com.montelzek.mydorm.event.EventRepository;
import com.montelzek.mydorm.event.EventService;
import com.montelzek.mydorm.event.payload.EventPayload;
import com.montelzek.mydorm.issue.EIssuePriority;
import com.montelzek.mydorm.issue.EIssueStatus;
import com.montelzek.mydorm.issue.Issue;
import com.montelzek.mydorm.issue.IssueRepository;
import com.montelzek.mydorm.issue.payload.IssuePayload;
import com.montelzek.mydorm.issue.IssueService;
import com.montelzek.mydorm.marketplace.MarketplaceListing;
import com.montelzek.mydorm.marketplace.MarketplaceListingRepository;
import com.montelzek.mydorm.marketplace.MarketplaceListingService;
import com.montelzek.mydorm.marketplace.payload.MarketplaceListingPayload;
import com.montelzek.mydorm.reservation.Reservation;
import com.montelzek.mydorm.reservation.ReservationRepository;
import com.montelzek.mydorm.reservation.ReservationService;
import com.montelzek.mydorm.reservation.payload.GraphQLPayloads.ReservationPayload;
import com.montelzek.mydorm.room.RoomRepository;
import com.montelzek.mydorm.user.ERole;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BuildingRepository buildingRepository;
    private final IssueRepository issueRepository;
    private final ReservationRepository reservationRepository;
    private final EventRepository eventRepository;
    private final MarketplaceListingRepository marketplaceListingRepository;
    
    private final AnnouncementService announcementService;
    private final EventService eventService;
    private final IssueService issueService;
    private final ReservationService reservationService;
    private final MarketplaceListingService marketplaceListingService;

    @Transactional(readOnly = true)
    public AdminDashboardData getAdminDashboard() {
        AdminDashboardStats stats = getAdminStats();
        IssueStats issueStats = getIssueStats();
        List<RecentIssuePayload> recentIssues = getRecentIssues();
        List<EventPayload> upcomingEvents = getUpcomingEvents();
        List<RecentReservationPayload> recentReservations = getRecentReservations();
        List<AnnouncementPayload> activeAnnouncements = getActiveAnnouncementsForAdmin();

        return new AdminDashboardData(
                stats,
                issueStats,
                recentIssues,
                upcomingEvents,
                recentReservations,
                activeAnnouncements
        );
    }

    @Transactional(readOnly = true)
    public ResidentDashboardData getResidentDashboard(Long userId) {
        ResidentUserInfo userInfo = getResidentUserInfo(userId);
        ResidentStats stats = getResidentStats(userId);
        List<ReservationPayload> myActiveReservations = getMyActiveReservations(userId);
        List<IssuePayload> myIssues = getMyIssues(userId);
        List<EventPayload> upcomingEvents = getUpcomingEventsForResident(userId);
        List<AnnouncementPayload> activeAnnouncements = announcementService.getActiveAnnouncementsForResident(userId);
        List<MarketplaceListingPayload> myActiveListings = getMyActiveListings(userId);

        return new ResidentDashboardData(
                userInfo,
                stats,
                myActiveReservations,
                myIssues,
                upcomingEvents,
                activeAnnouncements,
                myActiveListings
        );
    }

    private AdminDashboardStats getAdminStats() {
        Long totalResidents = userRepository.countByRolesContaining(ERole.ROLE_RESIDENT);
        Long totalRooms = roomRepository.count();
        Long totalBuildings = buildingRepository.count();
        Long occupiedRooms = roomRepository.countOccupiedRooms();
        Long availableRooms = roomRepository.countAvailableRooms();
        Long totalReservations = reservationRepository.count();
        Long totalIssues = issueRepository.count();

        return new AdminDashboardStats(
                totalResidents.intValue(),
                totalRooms.intValue(),
                totalBuildings.intValue(),
                occupiedRooms.intValue(),
                availableRooms.intValue(),
                totalReservations.intValue(),
                totalIssues.intValue()
        );
    }

    private IssueStats getIssueStats() {
        Long reported = issueRepository.countByStatus(EIssueStatus.REPORTED);
        Long inProgress = issueRepository.countByStatus(EIssueStatus.IN_PROGRESS);
        Long resolved = issueRepository.countByStatus(EIssueStatus.RESOLVED);
        Long lowPriority = issueRepository.countByPriority(EIssuePriority.LOW);
        Long mediumPriority = issueRepository.countByPriority(EIssuePriority.MEDIUM);
        Long highPriority = issueRepository.countByPriority(EIssuePriority.HIGH);

        return new IssueStats(
                reported.intValue(),
                inProgress.intValue(),
                resolved.intValue(),
                lowPriority.intValue(),
                mediumPriority.intValue(),
                highPriority.intValue()
        );
    }

    private List<RecentIssuePayload> getRecentIssues() {
        List<Issue> issues = issueRepository.findTop5ByOrderByCreatedAtDesc();
        return issues.stream()
                .limit(5)
                .map(this::mapToRecentIssuePayload)
                .collect(Collectors.toList());
    }

    private List<EventPayload> getUpcomingEvents() {
        List<Event> events = eventRepository.findTop5ByEventDateGreaterThanEqualOrderByEventDateAscStartTimeAsc(LocalDate.now());
        return events.stream()
                .limit(5)
                .map(eventService::toPayload)
                .collect(Collectors.toList());
    }

    private List<RecentReservationPayload> getRecentReservations() {
        List<Reservation> reservations = reservationRepository.findTop5ByOrderByCreatedAtDesc();
        return reservations.stream()
                .limit(5)
                .map(this::mapToRecentReservationPayload)
                .collect(Collectors.toList());
    }

    private List<AnnouncementPayload> getActiveAnnouncementsForAdmin() {
        // Get global announcements only for admin dashboard (no building filter)
        return announcementService.getAllAnnouncements(0, 5).content()
                .stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    private ResidentUserInfo getResidentUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String roomNumber = user.getRoom() != null ? user.getRoom().getRoomNumber() : null;
        String buildingName = user.getRoom() != null && user.getRoom().getBuilding() != null 
                ? user.getRoom().getBuilding().getName() : null;

        return new ResidentUserInfo(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                roomNumber,
                buildingName
        );
    }

    private ResidentStats getResidentStats(Long userId) {
        Long totalReservations = (long) reservationRepository.findByUserId(userId).size();
        Long totalIssues = (long) issueRepository.findByUserId(userId).size();
        Long activeListings = marketplaceListingRepository.countByUserId(userId);

        return new ResidentStats(
                totalReservations.intValue(),
                totalIssues.intValue(),
                activeListings.intValue()
        );
    }

    private List<ReservationPayload> getMyActiveReservations(Long userId) {
        List<Reservation> reservations = reservationRepository.findByUserIdAndStartTimeAfter(userId, LocalDateTime.now());
        return reservations.stream()
                .limit(5)
                .map(reservationService::toPayload)
                .collect(Collectors.toList());
    }

    private List<IssuePayload> getMyIssues(Long userId) {
        List<Issue> issues = issueRepository.findByUserId(userId);
        return issues.stream()
                .limit(10)
                .map(issueService::toPayload)
                .collect(Collectors.toList());
    }

    private List<EventPayload> getUpcomingEventsForResident(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Long buildingId = user.getRoom() != null && user.getRoom().getBuilding() != null 
                ? user.getRoom().getBuilding().getId() : null;

        List<Event> events = eventRepository.findTop5ByEventDateAndBuildingOrderByEventDateAsc(
                LocalDate.now(), buildingId);
        
        return events.stream()
                .limit(5)
                .map(eventService::toPayload)
                .collect(Collectors.toList());
    }

    private List<MarketplaceListingPayload> getMyActiveListings(Long userId) {
        List<MarketplaceListing> listings = marketplaceListingRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return listings.stream()
                .limit(5)
                .map(listing -> marketplaceListingService.toPayload(listing, userId))
                .collect(Collectors.toList());
    }

    private RecentIssuePayload mapToRecentIssuePayload(Issue issue) {
        String userName = issue.getUser() != null 
                ? issue.getUser().getFirstName() + " " + issue.getUser().getLastName() 
                : "Unknown";
        String buildingName = issue.getBuilding() != null ? issue.getBuilding().getName() : null;

        return new RecentIssuePayload(
                issue.getId(),
                issue.getTitle(),
                issue.getStatus().name(),
                issue.getPriority().name(),
                userName,
                buildingName,
                issue.getCreatedAt()
        );
    }

    private RecentReservationPayload mapToRecentReservationPayload(Reservation reservation) {
        String userName = reservation.getUser() != null 
                ? reservation.getUser().getFirstName() + " " + reservation.getUser().getLastName() 
                : "Unknown";
        String resourceName = reservation.getReservationResource() != null 
                ? reservation.getReservationResource().getName() : "Unknown";
        String buildingName = reservation.getReservationResource() != null 
                && reservation.getReservationResource().getBuilding() != null
                ? reservation.getReservationResource().getBuilding().getName() : null;

        return new RecentReservationPayload(
                reservation.getId(),
                userName,
                resourceName,
                buildingName,
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getStatus()
        );
    }
}

