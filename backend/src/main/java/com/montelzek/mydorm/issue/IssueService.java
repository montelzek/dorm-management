package com.montelzek.mydorm.issue;

import com.montelzek.mydorm.issue.payload.*;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class IssueService {

    private final IssueRepository issueRepository;
    private final UserRepository userRepository;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Transactional
    public Issue createIssue(String title, String description, EIssuePriority priority, User user) {
        User currentUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        Issue issue = new Issue();
        issue.setTitle(title);
        issue.setDescription(description);
        issue.setPriority(priority);
        issue.setStatus(EIssueStatus.REPORTED);
        issue.setUser(currentUser);

        // Automatically set room and building from user
        if (currentUser.getRoom() != null) {
            issue.setRoom(currentUser.getRoom());
            issue.setBuilding(currentUser.getRoom().getBuilding());
        }

        return issueRepository.save(issue);
    }

    public List<IssuePayload> getUserIssues(Long userId, String statusFilter) {
        List<Issue> issues;
        
        if (statusFilter != null && !statusFilter.isEmpty()) {
            try {
                EIssueStatus status = EIssueStatus.valueOf(statusFilter.toUpperCase());
                issues = issueRepository.findByUserIdAndStatus(userId, status);
            } catch (IllegalArgumentException e) {
                // Invalid status, return all issues
                issues = issueRepository.findByUserId(userId);
            }
        } else {
            issues = issueRepository.findByUserId(userId);
        }

        return issues.stream()
                .map(this::toPayload)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean cancelIssue(Long issueId, Long userId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue with given ID not found: " + issueId));

        if (!issue.getUser().getId().equals(userId)) {
            throw new IllegalStateException("You can only cancel your own issues");
        }

        if (issue.getStatus() != EIssueStatus.REPORTED) {
            throw new IllegalStateException("You can only cancel issues with REPORTED status");
        }

        issue.setStatus(EIssueStatus.CANCELLED);
        issueRepository.save(issue);

        return true;
    }

    public IssuePayload toPayload(Issue issue) {
        IssueRoomPayload roomPayload = null;
        IssueBuildingPayload buildingPayload = null;

        if (issue.getRoom() != null) {
            roomPayload = new IssueRoomPayload(
                    issue.getRoom().getId(),
                    issue.getRoom().getRoomNumber()
            );
        }

        if (issue.getBuilding() != null) {
            buildingPayload = new IssueBuildingPayload(
                    issue.getBuilding().getId(),
                    issue.getBuilding().getName()
            );
        }

        return new IssuePayload(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus().name(),
                issue.getPriority().name(),
                issue.getCreatedAt().format(DATE_TIME_FORMATTER),
                issue.getUpdatedAt().format(DATE_TIME_FORMATTER),
                roomPayload,
                buildingPayload
        );
    }

    // Admin methods
    @Transactional
    public AdminIssuesPagePayload getAllIssues(Integer page, Integer size, String statusFilter, 
                                                 String priorityFilter, Long buildingId) {
        try {
            int pageNumber = (page != null && page >= 0) ? page : 0;
            int pageSize = (size != null && size > 0) ? size : 10;
            
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
            
            EIssueStatus status = null;
            if (statusFilter != null && !statusFilter.isEmpty()) {
                try {
                    status = EIssueStatus.valueOf(statusFilter.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore filter
                }
            }
            
            EIssuePriority priority = null;
            if (priorityFilter != null && !priorityFilter.isEmpty()) {
                try {
                    priority = EIssuePriority.valueOf(priorityFilter.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid priority, ignore filter
                }
            }
            
            Page<Issue> issuesPage = issueRepository.findByFilters(status, priority, buildingId, pageable);
            
            List<AdminIssuePayload> content = issuesPage.getContent().stream()
                    .map(this::toAdminPayload)
                    .collect(Collectors.toList());
            
            return new AdminIssuesPagePayload(
                    content,
                    (int) issuesPage.getTotalElements(),
                    issuesPage.getTotalPages(),
                    issuesPage.getNumber(),
                    issuesPage.getSize()
            );
        } catch (Exception e) {
            log.error("Error in getAllIssues: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to get issues", e);
        }
    }

    @Transactional
    public AdminIssuePayload updateIssueStatus(Long issueId, String newStatus) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue with given ID not found: " + issueId));
        
        EIssueStatus status;
        try {
            status = EIssueStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
        
        issue.setStatus(status);
        Issue updatedIssue = issueRepository.save(issue);
        
        return toAdminPayload(updatedIssue);
    }

    public AdminIssuePayload toAdminPayload(Issue issue) {
        IssueUserPayload userPayload = new IssueUserPayload(
                issue.getUser().getId(),
                issue.getUser().getFirstName(),
                issue.getUser().getLastName()
        );
        
        IssueRoomPayload roomPayload = null;
        if (issue.getRoom() != null) {
            roomPayload = new IssueRoomPayload(
                    issue.getRoom().getId(),
                    issue.getRoom().getRoomNumber()
            );
        }
        
        IssueBuildingPayload buildingPayload = null;
        if (issue.getBuilding() != null) {
            buildingPayload = new IssueBuildingPayload(
                    issue.getBuilding().getId(),
                    issue.getBuilding().getName()
            );
        }
        
        IssueTechnicianPayload technicianPayload = null;
        if (issue.getAssignedTechnician() != null) {
            technicianPayload = new IssueTechnicianPayload(
                    issue.getAssignedTechnician().getId(),
                    issue.getAssignedTechnician().getFirstName(),
                    issue.getAssignedTechnician().getLastName()
            );
        }
        
        return new AdminIssuePayload(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus().name(),
                issue.getPriority().name(),
                issue.getCreatedAt().format(DATE_TIME_FORMATTER),
                issue.getUpdatedAt().format(DATE_TIME_FORMATTER),
                userPayload,
                roomPayload,
                buildingPayload,
                technicianPayload
        );
    }

    // Admin - Assign technician to issue
    @Transactional
    public AdminIssuePayload assignTechnician(Long issueId, Long technicianId) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue with given ID not found: " + issueId));
        
        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new IllegalArgumentException("Technician with given ID not found: " + technicianId));
        
        // Verify that the user is actually a technician
        if (!technician.getRoles().contains(com.montelzek.mydorm.user.ERole.ROLE_TECHNICIAN)) {
            throw new IllegalArgumentException("User is not a technician");
        }
        
        issue.setAssignedTechnician(technician);
        Issue updatedIssue = issueRepository.save(issue);
        
        return toAdminPayload(updatedIssue);
    }

    // Technician methods
    @Transactional
    public TechnicianIssuesPagePayload getMyAssignedTasks(Long technicianId, Integer page, Integer size, String statusFilter) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        List<EIssueStatus> statuses = new ArrayList<>();
        if (statusFilter != null && !statusFilter.isEmpty()) {
            try {
                statuses.add(EIssueStatus.valueOf(statusFilter.toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid status, show REPORTED and IN_PROGRESS by default
                statuses.add(EIssueStatus.REPORTED);
                statuses.add(EIssueStatus.IN_PROGRESS);
            }
        } else {
            statuses.add(EIssueStatus.REPORTED);
            statuses.add(EIssueStatus.IN_PROGRESS);
        }
        
        Page<Issue> issuesPage = issueRepository.findByAssignedTechnicianIdAndStatusIn(technicianId, statuses, pageable);
        
        List<TechnicianIssuePayload> content = issuesPage.getContent().stream()
                .map(this::toTechnicianPayload)
                .collect(Collectors.toList());
        
        return new TechnicianIssuesPagePayload(
                content,
                (int) issuesPage.getTotalElements(),
                issuesPage.getTotalPages(),
                issuesPage.getNumber(),
                issuesPage.getSize()
        );
    }

    @Transactional
    public TechnicianIssuesPagePayload getMyTasksHistory(Long technicianId, Integer page, Integer size, Long buildingId) {
        int pageNumber = (page != null && page >= 0) ? page : 0;
        int pageSize = (size != null && size > 0) ? size : 10;
        
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "updatedAt"));
        
        List<EIssueStatus> statuses = List.of(EIssueStatus.RESOLVED, EIssueStatus.CANCELLED);
        
        Page<Issue> issuesPage;
        if (buildingId != null) {
            issuesPage = issueRepository.findByAssignedTechnicianIdAndStatusInAndBuildingId(technicianId, statuses, buildingId, pageable);
        } else {
            issuesPage = issueRepository.findByAssignedTechnicianIdAndStatusIn(technicianId, statuses, pageable);
        }
        
        List<TechnicianIssuePayload> content = issuesPage.getContent().stream()
                .map(this::toTechnicianPayload)
                .collect(Collectors.toList());
        
        return new TechnicianIssuesPagePayload(
                content,
                (int) issuesPage.getTotalElements(),
                issuesPage.getTotalPages(),
                issuesPage.getNumber(),
                issuesPage.getSize()
        );
    }

    @Transactional
    public TechnicianDashboardStats getTechnicianDashboardStats(Long technicianId) {
        List<EIssueStatus> activeStatuses = List.of(EIssueStatus.REPORTED, EIssueStatus.IN_PROGRESS);
        
        int activeTasks = issueRepository.countByAssignedTechnicianIdAndStatusIn(technicianId, activeStatuses).intValue();
        int resolvedTasks = issueRepository.countByAssignedTechnicianIdAndStatus(technicianId, EIssueStatus.RESOLVED).intValue();
        int inProgressTasks = issueRepository.countByAssignedTechnicianIdAndStatus(technicianId, EIssueStatus.IN_PROGRESS).intValue();
        int reportedTasks = issueRepository.countByAssignedTechnicianIdAndStatus(technicianId, EIssueStatus.REPORTED).intValue();
        int highPriorityTasks = issueRepository.countByAssignedTechnicianIdAndPriority(technicianId, EIssuePriority.HIGH).intValue();
        int urgentPriorityTasks = issueRepository.countByAssignedTechnicianIdAndPriority(technicianId, EIssuePriority.URGENT).intValue();
        
        return new TechnicianDashboardStats(
                activeTasks,
                resolvedTasks,
                inProgressTasks,
                reportedTasks,
                highPriorityTasks,
                urgentPriorityTasks
        );
    }

    @Transactional
    public TechnicianIssuePayload updateTaskStatus(Long issueId, Long technicianId, String newStatus) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue with given ID not found: " + issueId));
        
        // Verify that the issue is assigned to this technician
        if (issue.getAssignedTechnician() == null || !issue.getAssignedTechnician().getId().equals(technicianId)) {
            throw new IllegalStateException("This issue is not assigned to you");
        }
        
        EIssueStatus status;
        try {
            status = EIssueStatus.valueOf(newStatus.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
        
        // Technician can only set REPORTED, IN_PROGRESS, or RESOLVED
        if (status != EIssueStatus.REPORTED && status != EIssueStatus.IN_PROGRESS && status != EIssueStatus.RESOLVED) {
            throw new IllegalArgumentException("Technician can only set status to REPORTED, IN_PROGRESS, or RESOLVED");
        }
        
        issue.setStatus(status);
        Issue updatedIssue = issueRepository.save(issue);
        
        return toTechnicianPayload(updatedIssue);
    }

    public TechnicianIssuePayload toTechnicianPayload(Issue issue) {
        IssueUserPayload userPayload = new IssueUserPayload(
                issue.getUser().getId(),
                issue.getUser().getFirstName(),
                issue.getUser().getLastName()
        );
        
        IssueRoomPayload roomPayload = null;
        if (issue.getRoom() != null) {
            roomPayload = new IssueRoomPayload(
                    issue.getRoom().getId(),
                    issue.getRoom().getRoomNumber()
            );
        }
        
        IssueBuildingPayload buildingPayload = null;
        if (issue.getBuilding() != null) {
            buildingPayload = new IssueBuildingPayload(
                    issue.getBuilding().getId(),
                    issue.getBuilding().getName()
            );
        }
        
        return new TechnicianIssuePayload(
                issue.getId(),
                issue.getTitle(),
                issue.getDescription(),
                issue.getStatus().name(),
                issue.getPriority().name(),
                issue.getCreatedAt().format(DATE_TIME_FORMATTER),
                issue.getUpdatedAt().format(DATE_TIME_FORMATTER),
                userPayload,
                roomPayload,
                buildingPayload
        );
    }

    public List<TechnicianPayload> getAvailableTechnicians() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().contains(com.montelzek.mydorm.user.ERole.ROLE_TECHNICIAN))
                .map(user -> new TechnicianPayload(
                        user.getId(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail()
                ))
                .collect(Collectors.toList());
    }
}

