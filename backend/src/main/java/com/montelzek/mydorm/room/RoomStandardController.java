package com.montelzek.mydorm.room;

import com.montelzek.mydorm.room.payload.CreateRoomStandardInput;
import com.montelzek.mydorm.room.payload.RoomStandardPayload;
import com.montelzek.mydorm.room.payload.UpdateRoomStandardInput;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.Argument;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@AllArgsConstructor
public class RoomStandardController {

    private final RoomStandardService service;
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @QueryMapping
    public List<RoomStandardPayload> adminRoomStandards() {
        return service.getAll().stream().map(this::toPayload).collect(Collectors.toList());
    }

    @QueryMapping
    public RoomStandardPayload roomStandard(@Argument Long id) {
        return toPayload(service.getById(id));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public RoomStandardPayload createRoomStandard(@Argument CreateRoomStandardInput input) {
        RoomStandard rs = new RoomStandard();
        rs.setName(input.name());
        rs.setCode(input.name());
        rs.setCapacity(input.capacity());
        // parse price string to BigDecimal safely
        BigDecimal price;
        try {
            price = new BigDecimal(input.price());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid price format: " + input.price());
        }
        rs.setPrice(price);
        RoomStandard created = service.create(rs);
        return toPayload(created);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public RoomStandardPayload updateRoomStandard(@Argument Long id, @Argument UpdateRoomStandardInput input) {
        RoomStandard update = new RoomStandard();
        update.setName(input.name());
        update.setCode(input.name());
        update.setCapacity(input.capacity());
        try {
            update.setPrice(new BigDecimal(input.price()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid price format: " + input.price());
        }
        RoomStandard saved = service.update(id, update);
        return toPayload(saved);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteRoomStandard(@Argument Long id) {
        return service.delete(id);
    }

    private RoomStandardPayload toPayload(RoomStandard rs) {
        return new RoomStandardPayload(
                rs.getId(),
                rs.getCode(),
                rs.getName(),
                rs.getCapacity(),
                rs.getPrice() != null ? rs.getPrice().toString() : null,
                rs.getCreatedAt() != null ? rs.getCreatedAt().format(DATE_TIME_FORMATTER) : null,
                rs.getUpdatedAt() != null ? rs.getUpdatedAt().format(DATE_TIME_FORMATTER) : null
        );
    }
}
