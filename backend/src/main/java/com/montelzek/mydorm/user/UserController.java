package com.montelzek.mydorm.user;

import com.montelzek.mydorm.room.payloads.RoomPayload;
import com.montelzek.mydorm.security.UserDetailsImpl;
import com.montelzek.mydorm.user.payloads.ResidentPage;
import com.montelzek.mydorm.user.payloads.ResidentPayload;
import com.montelzek.mydorm.user.payloads.UpdateProfileInput;
import com.montelzek.mydorm.user.payloads.UserProfilePayload;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import com.montelzek.mydorm.reservation.payload.GraphQLPayloads;
import com.montelzek.mydorm.room.RoomService;

import java.util.List;

@Controller
@AllArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final RoomService roomService;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public User me(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userRepository.findById(userDetails.getId()).orElse(null);
    }

    @SchemaMapping(typeName = "UserPayload", field = "building")
    public Object getBuildingForUser(Object source) {
        // support both domain User and payload UserPayload
        if (source instanceof User user) {
            if (user.getRoom() != null) {
                return user.getRoom().getBuilding();
            }
            return null;
        }

        if (source instanceof GraphQLPayloads.UserPayload up) {
            return up.building(); // return payload building (id,name) - GraphQL will map fields
        }

        return null;
    }

    @SchemaMapping(typeName = "UserPayload", field = "role")
    public String getRoleForUser(Object source) {
        if (source instanceof User user) {
            return user.getRoles().iterator().next().name();
        }
        if (source instanceof GraphQLPayloads.UserPayload up) {
            return up.role();
        }
        return null;
    }

    @SchemaMapping(typeName = "UserPayload", field = "room")
    public Object getRoomForUser(Object source) {
        if (source instanceof User user) {
            return user.getRoom();
        }
        if (source instanceof GraphQLPayloads.UserPayload up) {
            return up.room();
        }
        return null;
    }

    // Resident management

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public ResidentPage allResidents(@Argument Integer page, @Argument Integer size, @Argument String search, @Argument String sortBy, @Argument String sortDirection) {
        return userService.getResidentsPage(page, size, search, sortBy, sortDirection);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public ResidentPage residentsByBuilding(@Argument Long buildingId, @Argument Integer page, @Argument Integer size, @Argument String search, @Argument String sortBy, @Argument String sortDirection) {
        return userService.getResidentsByBuildingPage(buildingId, page, size, search, sortBy, sortDirection);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<RoomPayload> availableRooms(@Argument Long buildingId) {
        return roomService.getAvailableRooms(buildingId);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResidentPayload assignRoom(@Argument Long userId, @Argument Long roomId) {
        return userService.assignRoom(userId, roomId);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteResident(@Argument Long userId) {
        return userService.deleteResident(userId);
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public UserProfilePayload updateMyProfile(@Argument UpdateProfileInput input, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userService.updateMyProfile(userDetails.getId(), input);
    }
}
