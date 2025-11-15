import { Injectable, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_MY_PAYMENTS, MARK_PAYMENT_AS_PAID } from '../finance-center.graphql';
import { ToastService } from '../../../../core/services/toast.service';
import { catchError, map, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Payment {
  id: string;
  month: string;
  amount: number;
  paid: boolean;
  paidAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);

  readonly myPayments = signal<Payment[]>([]);
  readonly isLoading = signal<boolean>(false);

  loadMyPayments() {
    this.isLoading.set(true);
    
    return this.apollo
      .query<{ myPayments: Payment[] }>({
        query: GET_MY_PAYMENTS,
        fetchPolicy: 'network-only'
      })
      .pipe(
        map(result => result.data.myPayments),
        tap(payments => {
          this.myPayments.set(payments);
          this.isLoading.set(false);
        }),
        catchError(error => {
          console.error('Error loading payments:', error);
          this.isLoading.set(false);
          this.toastService.showError('Failed to load payments');
          return of([]);
        })
      )
      .subscribe();
  }

  markAsPaid(paymentId: string) {
    return this.apollo
      .mutate<{ markPaymentAsPaid: Payment }>({
        mutation: MARK_PAYMENT_AS_PAID,
        variables: { paymentId }
      })
      .pipe(
        tap(result => {
          if (result.data?.markPaymentAsPaid) {
            const updatedPayments = this.myPayments().map(p =>
              p.id === paymentId ? result.data!.markPaymentAsPaid : p
            );
            this.myPayments.set(updatedPayments);
          }
        }),
        catchError(error => {
          console.error('Error marking payment as paid:', error);
          throw error;
        })
      );
  }

  getMonthDisplayName(month: string): string {
    const monthMap: { [key: string]: string } = {
      'OCTOBER': 'October',
      'NOVEMBER': 'November',
      'DECEMBER': 'December',
      'JANUARY': 'January',
      'FEBRUARY': 'February',
      'MARCH': 'March',
      'APRIL': 'April',
      'MAY': 'May',
      'JUNE': 'June'
    };
    return monthMap[month] || month;
  }
}
