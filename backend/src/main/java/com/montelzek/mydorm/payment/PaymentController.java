package com.montelzek.mydorm.payment;

import com.montelzek.mydorm.payment.payload.PaymentPayload;
import com.montelzek.mydorm.security.UserDetailsImpl;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.Collections;
import java.util.List;

@Controller
@AllArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public List<PaymentPayload> myPayments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null || userDetails.getId() == null) {
            return Collections.emptyList();
        }
        
        try {
            List<PaymentPayload> payments = paymentService.getUserPayments(userDetails.getId());
            return payments != null ? payments : Collections.emptyList();
        } catch (Exception e) {
            log.error("Error getting payments for user {}: {}", userDetails.getId(), e.getMessage());
            return Collections.emptyList();
        }
    }

    @MutationMapping
    @PreAuthorize("isAuthenticated()")
    public PaymentPayload markPaymentAsPaid(
            @Argument Long paymentId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return paymentService.markPaymentAsPaid(paymentId, userDetails.getId());
    }
}
