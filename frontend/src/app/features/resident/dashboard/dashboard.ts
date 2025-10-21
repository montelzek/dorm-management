import { Component, inject, OnInit } from '@angular/core';

import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { ThemeToggleComponent } from '../../../shared/components/ui/theme-toggle/theme-toggle';
import { UserService } from '../../../core/services/user.service';

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
  private readonly userService = inject(UserService);

  readonly currentUser = this.userService.currentUser;
  readonly isLoading = this.userService.isLoading;
  readonly error = this.userService.error;

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.userService.loadCurrentUser();
  }
}
