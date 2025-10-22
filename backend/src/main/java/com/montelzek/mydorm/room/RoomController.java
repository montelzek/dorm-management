package com.montelzek.mydorm.room;

import com.montelzek.mydorm.room.payload.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public RoomsPagePayload adminRooms(
            @Argument Integer page,
            @Argument Integer size,
            @Argument Long buildingId,
            @Argument String status) {
        return roomService.getAllRooms(page, size, buildingId, status);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminRoomPayload createRoom(@Argument @Valid CreateRoomInput input) {
        return roomService.createRoom(input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminRoomPayload updateRoom(
            @Argument Long id,
            @Argument @Valid UpdateRoomInput input) {
        return roomService.updateRoom(id, input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteRoom(@Argument Long id) {
        return roomService.deleteRoom(id);
    }
}

