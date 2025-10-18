import {Component, inject, signal} from '@angular/core';
import {Sidebar} from '../../../shared/components/sidebar/sidebar';
import {ThemeToggle} from '../../../shared/components/theme-toggle/theme-toggle';
import {Header} from '../../../shared/components/header/header';
import {ReservationService} from '../reservations/reservation.service';
import {User} from '../../../graphql.types';

@Component({
  selector: 'app-dashboard',
  imports: [
    Sidebar,
    ThemeToggle,
    Header
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private reservationService = inject(ReservationService);
  currentUser = signal<User | null>(null);

  constructor() {
    this.reservationService.getMyDetails().subscribe(user => {
      this.currentUser.set(user);
    });
  }
}
