package com.montelzek.mydorm.room;

import com.montelzek.mydorm.exception.BusinessException;
import com.montelzek.mydorm.exception.ErrorCodes;
import com.montelzek.mydorm.payment.PaymentService;
import com.montelzek.mydorm.user.User;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class RoomStandardService {

    private final RoomStandardRepository repository;
    private final RoomRepository roomRepository;
    private final PaymentService paymentService;

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
        
        BigDecimal oldPrice = existing.getPrice();
        BigDecimal newPrice = input.getPrice();
        
        existing.setCode(input.getCode());
        existing.setName(input.getName());
        existing.setCapacity(input.getCapacity());
        existing.setPrice(newPrice);
        
        RoomStandard updated = repository.save(existing);
        
        // Jeśli cena się zmieniła, zaktualizuj płatności dla wszystkich użytkowników z tym standardem
        if (oldPrice.compareTo(newPrice) != 0) {
            List<Room> rooms = roomRepository.findByRoomStandardId(id);
            for (Room room : rooms) {
                for (User user : room.getUsers()) {
                    try {
                        paymentService.updatePaymentAmountsForUser(user, newPrice);
                    } catch (Exception e) {
                        log.error("Failed to update payments for user {}: {}", user.getId(), e.getMessage());
                    }
                }
            }
        }
        
        return updated;
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
