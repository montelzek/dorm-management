import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-technician-dashboard',
  standalone: true,
  imports: [CommonModule, MainLayoutComponent],
  templateUrl: './dashboard.html'
})
export class TechnicianDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  readonly currentUser = this.userService.currentUser;

  constructor() {
    // reactively check user role; if not technician we won't load technician-specific data
    effect(() => {
      const user = this.currentUser();
      if (user && user.role !== 'ROLE_TECHNICIAN') {
        // nothing for now; component will still render but could be protected elsewhere
      }
    });
  }

  ngOnInit(): void {
    this.userService.loadCurrentUser();
  }
}

