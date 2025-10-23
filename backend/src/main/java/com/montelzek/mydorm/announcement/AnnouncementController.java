package com.montelzek.mydorm.announcement;

import com.montelzek.mydorm.announcement.payload.*;
import com.montelzek.mydorm.security.UserDetailsImpl;
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
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AnnouncementsPagePayload adminAnnouncements(
            @Argument Integer page,
            @Argument Integer size
    ) {
        return announcementService.getAllAnnouncements(page, size);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<AnnouncementPayload> residentAnnouncements(
            @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        if (userDetails == null) {
            System.out.println("ERROR: UserDetails is null in residentAnnouncements!");
            return List.of(); // Return empty list instead of null
        }
        System.out.println("residentAnnouncements called for user ID: " + userDetails.getId());
        return announcementService.getActiveAnnouncementsForResident(userDetails.getId());
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AnnouncementPayload createAnnouncement(
            @Argument CreateAnnouncementInput input
    ) {
        return announcementService.createAnnouncement(input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AnnouncementPayload updateAnnouncement(
            @Argument Long id,
            @Argument UpdateAnnouncementInput input
    ) {
        return announcementService.updateAnnouncement(id, input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteAnnouncement(
            @Argument Long id
    ) {
        return announcementService.deleteAnnouncement(id);
    }
}

