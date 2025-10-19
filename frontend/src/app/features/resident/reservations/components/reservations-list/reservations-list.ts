import { Component, input, signal, computed } from '@angular/core';
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

  private readonly _sortDirection = signal<SortDirection>('desc');
  readonly sortDirection = this._sortDirection.asReadonly();

  readonly sortedReservations = computed(() => {
    const reservations = this.reservations();
    const direction = this._sortDirection();

    return [...reservations].sort((a, b) => {
      const dateA = new Date(a.startTime).getTime();
      const dateB = new Date(b.startTime).getTime();

      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  });

  get hasReservations(): boolean {
    return this.reservations().length > 0;
  }

  toggleSort(): void {
    this._sortDirection.set(this._sortDirection() === 'asc' ? 'desc' : 'asc');
  }
}
