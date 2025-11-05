package com.montelzek.mydorm.room;

import com.montelzek.mydorm.exception.BusinessException;
import com.montelzek.mydorm.exception.ErrorCodes;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RoomStandardService {

    private final RoomStandardRepository repository;
    private final RoomRepository roomRepository;

    public List<RoomStandard> getAll() {
        return repository.findAll();
    }

    public RoomStandard getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("RoomStandard not found with id: " + id));
    }

    @Transactional
    public RoomStandard create(RoomStandard standard) {
        return repository.save(standard);
    }

    @Transactional
    public RoomStandard update(Long id, RoomStandard input) {
        RoomStandard existing = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("RoomStandard not found with id: " + id));
        existing.setCode(input.getCode());
        existing.setName(input.getName());
        existing.setCapacity(input.getCapacity());
        existing.setPrice(input.getPrice());
        return repository.save(existing);
    }

    @Transactional
    public Boolean delete(Long id) {
        if (!repository.existsById(id)) {
            throw new IllegalArgumentException("RoomStandard not found with id: " + id);
        }
        // check if any room references this standard
        long count = roomRepository.countByRoomStandardId(id);
        if (count > 0) {
            throw new BusinessException(ErrorCodes.STANDARD_IN_USE, "Cannot delete standard: assigned to " + count + " room(s)", "roomStandard");
        }
        repository.deleteById(id);
        return true;
    }

    public long countUsage(Long id) {
        return roomRepository.countByRoomStandardId(id);
    }
}
