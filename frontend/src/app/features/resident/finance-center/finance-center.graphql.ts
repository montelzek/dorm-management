import { gql } from 'apollo-angular';

export const GET_MY_PAYMENTS = gql`
  query GetMyPayments {
    myPayments {
      id
      month
      amount
      paid
      paidAt
    }
  }
`;

export const MARK_PAYMENT_AS_PAID = gql`
  mutation MarkPaymentAsPaid($paymentId: ID!) {
    markPaymentAsPaid(paymentId: $paymentId) {
      id
      month
      amount
      paid
      paidAt
    }
  }
`;
