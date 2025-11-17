package com.montelzek.mydorm.issue;

import com.montelzek.mydorm.issue.payload.*;
import com.montelzek.mydorm.security.UserDetailsImpl;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.validation.Valid;
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
public class IssueController {

    private final IssueService issueService;
    private final UserRepository userRepository;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<IssuePayload> myIssues(
            @Argument String status,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return issueService.getUserIssues(userDetails.getId(), status);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public IssuePayload createIssue(
            @Argument @Valid CreateIssueInput input,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        
        User currentUser = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        EIssuePriority priority;
        try {
            priority = EIssuePriority.valueOf(input.priority().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid priority: " + input.priority());
        }

        Issue createdIssue = issueService.createIssue(
                input.title(),
                input.description(),
                priority,
                currentUser
        );

        return issueService.toPayload(createdIssue);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public Boolean cancelIssue(
            @Argument Long issueId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return issueService.cancelIssue(issueId, userDetails.getId());
    }

    // Admin endpoints
    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminIssuesPagePayload allIssues(
            @Argument Integer page,
            @Argument Integer size,
            @Argument String status,
            @Argument String priority,
            @Argument Long buildingId) {
        return issueService.getAllIssues(page, size, status, priority, buildingId);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminIssuePayload updateIssueStatus(
            @Argument Long issueId,
            @Argument String status) {
        return issueService.updateIssueStatus(issueId, status);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<TechnicianPayload> availableTechnicians() {
        return issueService.getAvailableTechnicians();
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminIssuePayload assignTechnician(
            @Argument Long issueId,
            @Argument Long technicianId) {
        return issueService.assignTechnician(issueId, technicianId);
    }

    // Technician endpoints
    @QueryMapping
    @PreAuthorize("hasRole('TECHNICIAN')")
    public TechnicianIssuesPagePayload myAssignedTasks(
            @Argument Integer page,
            @Argument Integer size,
            @Argument String status,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return issueService.getMyAssignedTasks(userDetails.getId(), page, size, status);
    }

    @QueryMapping
    @PreAuthorize("hasRole('TECHNICIAN')")
    public TechnicianIssuesPagePayload myTasksHistory(
            @Argument Integer page,
            @Argument Integer size,
            @Argument Long buildingId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return issueService.getMyTasksHistory(userDetails.getId(), page, size, buildingId);
    }

    @QueryMapping
    @PreAuthorize("hasRole('TECHNICIAN')")
    public TechnicianDashboardStats technicianDashboardStats(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return issueService.getTechnicianDashboardStats(userDetails.getId());
    }

    @MutationMapping
    @PreAuthorize("hasRole('TECHNICIAN')")
    public TechnicianIssuePayload updateTaskStatus(
            @Argument Long issueId,
            @Argument String status,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return issueService.updateTaskStatus(issueId, userDetails.getId(), status);
    }
}

