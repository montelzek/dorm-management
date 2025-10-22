import {Component, input, output} from '@angular/core';
import {AdminReservation} from '../../models/admin-reservation.models';

@Component({
  selector: 'app-reservation-list',
  imports: [],
  templateUrl: 'reservation-list.html'
})
export class ReservationListComponent {
  readonly reservations = input<AdminReservation[]>([]);
  readonly sortDirection = input<'asc' | 'desc'>('asc');
  
  readonly viewDetails = output<AdminReservation>();
  readonly cancelReservation = output<AdminReservation>();
  
  onViewDetails(reservation: AdminReservation): void {
    this.viewDetails.emit(reservation);
  }

  onCancelReservation(reservation: AdminReservation): void {
    this.cancelReservation.emit(reservation);
  }
}

