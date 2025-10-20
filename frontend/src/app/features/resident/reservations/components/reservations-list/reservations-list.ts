import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationPayload } from '../../../../../shared/models/graphql.types';

type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-reservations-list',
  imports: [CommonModule, DatePipe],
  templateUrl: './reservations-list.html',
  styles: []
})
export class ReservationsListComponent {
  readonly reservations = input<ReservationPayload[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly cancelReservation = output<string>();

  private readonly _sortDirection = signal<SortDirection>('desc');
  readonly sortDirection = this._sortDirection.asReadonly();

  readonly activeReservations = computed(() => {
    const reservations = this.reservations();
    const now = new Date();
    
    // Filtruj tylko przyszłe rezerwacje (aktywne)
    return reservations.filter(reservation => {
      const reservationStart = new Date(reservation.startTime);
      return reservationStart > now;
    });
  });

  readonly sortedReservations = computed(() => {
    const reservations = this.activeReservations();
    const direction = this._sortDirection();

    return [...reservations].sort((a, b) => {
      // Sortowanie po statusie (CONFIRMED pierwsze, potem CANCELLED)
      const statusOrder = { 'CONFIRMED': 0, 'CANCELLED': 1 };
      const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 2;
      const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 2;
      
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      
      // Jeśli statusy są takie same, sortuj po dacie
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();

      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  });

  get hasReservations(): boolean {
    return this.activeReservations().length > 0;
  }

  toggleSort(): void {
    this._sortDirection.set(this._sortDirection() === 'asc' ? 'desc' : 'asc');
  }

  canCancelReservation(reservation: ReservationPayload): boolean {
    if (reservation.status !== 'CONFIRMED') {
      return false;
    }

    const now = new Date();
    const reservationStart = new Date(reservation.startTime);
    
    return reservationStart > now;
  }

  onCancelReservation(reservationId: string): void {
    this.cancelReservation.emit(reservationId);
  }

  getStatusBadgeClasses(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'CANCELLED':
        return 'inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'COMPLETED':
        return 'inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  getStatusDisplayText(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  }
}
