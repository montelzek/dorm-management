package com.montelzek.mydorm.issue;

import com.montelzek.mydorm.issue.payload.IssueBuildingPayload;
import com.montelzek.mydorm.issue.payload.IssuePayload;
import com.montelzek.mydorm.issue.payload.IssueRoomPayload;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
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
}

