package com.montelzek.mydorm.payment;

import com.montelzek.mydorm.payment.payload.PaymentPayload;
import com.montelzek.mydorm.room.RoomStandard;
import com.montelzek.mydorm.user.User;
import com.montelzek.mydorm.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    private static final List<EPaymentMonth> ACADEMIC_YEAR_MONTHS = Arrays.asList(
        EPaymentMonth.OCTOBER,
        EPaymentMonth.NOVEMBER,
        EPaymentMonth.DECEMBER,
        EPaymentMonth.JANUARY,
        EPaymentMonth.FEBRUARY,
        EPaymentMonth.MARCH,
        EPaymentMonth.APRIL,
        EPaymentMonth.MAY,
        EPaymentMonth.JUNE
    );

    /**
     * Generuje płatności dla użytkownika po przydzieleniu pokoju
     */
    @Transactional
    public void generatePaymentsForUser(User user) {
        if (user.getRoom() == null || user.getRoom().getRoomStandard() == null) {
            throw new IllegalStateException("User must have a room with a room standard assigned");
        }

        RoomStandard roomStandard = user.getRoom().getRoomStandard();
        BigDecimal monthlyPrice = roomStandard.getPrice();

        List<Payment> payments = new ArrayList<>();
        
        for (EPaymentMonth month : ACADEMIC_YEAR_MONTHS) {
            // Sprawdź czy płatność już istnieje
            if (!paymentRepository.existsByUserAndMonth(user, month)) {
                Payment payment = new Payment(user, month, monthlyPrice);
                payments.add(payment);
            }
        }

        if (!payments.isEmpty()) {
            paymentRepository.saveAll(payments);
        }
    }

    /**
     * Aktualizuje kwoty płatności po zmianie ceny pokoju
     */
    @Transactional
    public void updatePaymentAmountsForUser(User user, BigDecimal newAmount) {
        List<Payment> userPayments = paymentRepository.findByUser(user);
        
        for (Payment payment : userPayments) {
            // Aktualizuj tylko nieopłacone płatności
            if (!payment.isPaid()) {
                payment.setAmount(newAmount);
            }
        }
        
        paymentRepository.saveAll(userPayments);
    }

    /**
     * Pobiera płatności dla zalogowanego użytkownika.
     * Jeśli użytkownik ma pokój, ale nie ma płatności - automatycznie je generuje (lazy loading).
     */
    public List<PaymentPayload> getUserPayments(Long userId) {
        if (userId == null) {
            return new ArrayList<>();
        }
        
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null || user.getRoom() == null) {
            return new ArrayList<>();
        }

        List<Payment> payments = paymentRepository.findByUserIdOrderByMonthAsc(userId);
        
        // Lazy loading: jeśli użytkownik ma pokój, ale nie ma płatności - wygeneruj je
        if (payments == null || payments.isEmpty()) {
            try {
                generatePaymentsForUser(user);
                payments = paymentRepository.findByUserIdOrderByMonthAsc(userId);
            } catch (Exception e) {
                log.error("Failed to generate payments for user {}: {}", userId, e.getMessage());
                return new ArrayList<>();
            }
        }
        
        if (payments == null) {
            return new ArrayList<>();
        }
        
        // Sortuj płatności według kolejności miesięcy (październik -> czerwiec)
        return payments.stream()
            .sorted((p1, p2) -> Integer.compare(p1.getMonth().getOrder(), p2.getMonth().getOrder()))
            .map(this::toPayload)
            .collect(Collectors.toList());
    }

    /**
     * Oznacza płatność jako opłaconą
     */
    @Transactional
    public PaymentPayload markPaymentAsPaid(Long paymentId, Long userId) {
        Payment payment = paymentRepository.findById(paymentId)
            .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        // Sprawdź czy płatność należy do użytkownika
        if (!payment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Payment does not belong to the user");
        }

        if (payment.isPaid()) {
            throw new IllegalStateException("Payment is already marked as paid");
        }

        payment.setPaid(true);
        payment.setPaidAt(LocalDateTime.now());
        
        Payment savedPayment = paymentRepository.save(payment);
        return toPayload(savedPayment);
    }

    /**
     * Usuwa płatności użytkownika (np. po usunięciu z pokoju)
     */
    @Transactional
    public void deleteUserPayments(User user) {
        paymentRepository.deleteByUser(user);
    }

    /**
     * Konwertuje Payment na PaymentPayload
     */
    private PaymentPayload toPayload(Payment payment) {
        return new PaymentPayload(
            payment.getId(),
            payment.getMonth().name(),
            payment.getAmount(),
            payment.isPaid(),
            payment.getPaidAt() != null ? payment.getPaidAt().toString() : null
        );
    }
}
