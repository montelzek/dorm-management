import { Component, inject, OnInit } from '@angular/core';

import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { ThemeToggleComponent } from '../../../shared/components/ui/theme-toggle/theme-toggle';
import { ReservationService } from '../reservations/services/reservation';

@Component({
  selector: 'app-dashboard',
  imports: [
    MainLayoutComponent,
    ThemeToggleComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private readonly reservationService = inject(ReservationService);

  readonly currentUser = this.reservationService.currentUser;
  readonly isLoading = this.reservationService.isLoading;
  readonly error = this.reservationService.error;

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.reservationService.loadUserDetails();
  }
}
