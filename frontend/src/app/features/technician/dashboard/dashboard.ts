import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { TechnicianService } from '../shared/technician.service';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent, RouterLink, TranslateModule],
  templateUrl: './dashboard.html'
})
export class TechnicianDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly technicianService = inject(TechnicianService);
  
  readonly currentUser = this.userService.currentUser;
  readonly stats = this.technicianService.dashboardStats;
  readonly isLoading = this.technicianService.isLoading;

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.technicianService.getDashboardStats();
  }
}

