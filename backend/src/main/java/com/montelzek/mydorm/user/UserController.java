package com.montelzek.mydorm.user;

import com.montelzek.mydorm.building.Building;
import com.montelzek.mydorm.security.UserDetailsImpl;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class UserController {

    private final UserRepository userRepository;

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
}
