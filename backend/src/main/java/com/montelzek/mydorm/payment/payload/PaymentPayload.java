package com.montelzek.mydorm.payment.payload;

import java.math.BigDecimal;

public record PaymentPayload(
    Long id,
    String month,
    BigDecimal amount,
    boolean paid,
    String paidAt
) {}
