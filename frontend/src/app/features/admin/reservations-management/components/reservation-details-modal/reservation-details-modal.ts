import {Component, input, output} from '@angular/core';
import {AdminReservation} from '../../models/admin-reservation.models';

@Component({
  selector: 'app-reservation-details-modal',
  imports: [],
  templateUrl: 'reservation-details-modal.html'
})
export class ReservationDetailsModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly reservation = input<AdminReservation | null>(null);
  
  readonly close = output<void>();
  
  onClose(): void {
    this.close.emit();
  }
}

