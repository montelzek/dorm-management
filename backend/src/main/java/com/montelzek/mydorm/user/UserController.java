package com.montelzek.mydorm.user;

import com.montelzek.mydorm.building.Building;
import com.montelzek.mydorm.room.Room;
import com.montelzek.mydorm.security.UserDetailsImpl;
import com.montelzek.mydorm.user.payloads.ResidentPayload;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@AllArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public User me(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return userRepository.findById(userDetails.getId()).orElse(null);
    }

    @SchemaMapping(typeName = "UserPayload", field = "building")
    public Building getBuildingForUser(User user) {
        if (user.getRoom() != null) {
            return user.getRoom().getBuilding();
        }
        return null;
    }

    @SchemaMapping(typeName = "UserPayload", field = "role")
    public String getRoleForUser(User user) {
        return user.getRoles().iterator().next().name();
    }

    @SchemaMapping(typeName = "UserPayload", field = "room")
    public Room getRoomForUser(User user) {
        return user.getRoom();
    }

    // Resident management

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<ResidentPayload> allResidents() {
        return userService.getResidentsAsPayloads();
    }
}
