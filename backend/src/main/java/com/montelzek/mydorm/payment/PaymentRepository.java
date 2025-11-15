package com.montelzek.mydorm.payment;

import com.montelzek.mydorm.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByUserIdOrderByMonthAsc(Long userId);
    
    Optional<Payment> findByUserAndMonth(User user, EPaymentMonth month);
    
    boolean existsByUserAndMonth(User user, EPaymentMonth month);
    
    List<Payment> findByUser(User user);
    
    void deleteByUser(User user);
}
