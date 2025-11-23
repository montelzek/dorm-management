import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { PaymentService } from './services/payment.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-finance-center',
  standalone: true,
  imports: [
    CommonModule,
    MainLayoutComponent,
    ButtonComponent,
    TranslateModule
  ],
  templateUrl: './finance-center.html'
})
export class FinanceCenterComponent implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly currentUser = this.userService.currentUser;
  readonly myPayments = this.paymentService.myPayments;
  readonly isLoading = this.paymentService.isLoading;

  readonly hasRoom = computed(() => {
    const user = this.currentUser();
    return user !== null;
  });

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.paymentService.loadMyPayments();
  }

  onMarkAsPaid(paymentId: string): void {
    this.paymentService.markAsPaid(paymentId).subscribe({
      next: () => {
        this.toastService.showSuccess('toast.success.paymentMarkedAsPaid');
      },
      error: (error) => this.handleError(error)
    });
  }

  getMonthDisplayName(month: string): string {
    return this.paymentService.getMonthDisplayName(month);
  }

  private handleError(error: any): void {
    console.error('Payment operation error:', error);
    
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = error.graphQLErrors[0].message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.toastService.showError(errorMessage);
  }
}
