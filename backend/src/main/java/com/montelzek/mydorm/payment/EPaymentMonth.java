package com.montelzek.mydorm.payment;

public enum EPaymentMonth {
    OCTOBER(1),
    NOVEMBER(2),
    DECEMBER(3),
    JANUARY(4),
    FEBRUARY(5),
    MARCH(6),
    APRIL(7),
    MAY(8),
    JUNE(9);

    private final int order;

    EPaymentMonth(int order) {
        this.order = order;
    }

    public int getOrder() {
        return order;
    }
}
