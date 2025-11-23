import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { AdminDashboardService, AnnouncementBuilding } from './services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    TranslateModule,
    MainLayoutComponent
  ],
  providers: [AdminDashboardService],
  templateUrl: './dashboard.html'
})
export class AdminDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dashboardService = inject(AdminDashboardService);
  private readonly router = inject(Router);

  readonly currentUser = this.userService.currentUser;
  readonly dashboardData = this.dashboardService.dashboardData;
  readonly isLoading = this.dashboardService.isLoading;
  readonly error = this.dashboardService.error;

  private dashboardLoaded = false;

  constructor() {
    // Load dashboard ONLY when user is loaded
    effect(() => {
      const user = this.currentUser();
      if (user && !this.dashboardLoaded) {
        this.dashboardLoaded = true;
        this.dashboardService.loadAdminDashboard();
      }
    });
  }

  ngOnInit(): void {
    this.userService.loadCurrentUser();
  }

  getStatusBadgeColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'REPORTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getPriorityBadgeColor(priority: string): string {
    switch (priority.toUpperCase()) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'URGENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getStatusKey(status: string): string {
    return `issues.status.${status}`;
  }

  getPriorityKey(priority: string): string {
    return `issues.priority.${priority}`;
  }

  getReservationStatusKey(status: string): string {
    return `reservations.status.${status}`;
  }

  getCategoryKey(category: string): string {
    return `announcements.category.${category}`;
  }

  getCategoryBadgeColor(category: string): string {
    switch (category.toUpperCase()) {
      case 'WATER':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'INTERNET':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'ELECTRICITY':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'MAINTENANCE':
        return 'bg-orange-100 text-orange-800 border border-orange-300';
      case 'GENERAL':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  navigateToIssues(): void {
    this.router.navigate(['/admin/issues']);
  }

  navigateToReservations(): void {
    this.router.navigate(['/admin/reservations']);
  }

  navigateToEvents(): void {
    this.router.navigate(['/admin/events']);
  }

  navigateToAnnouncements(): void {
    this.router.navigate(['/admin/announcements']);
  }

  getBuildingNames(buildings: AnnouncementBuilding[]): string {
    return buildings.map(b => b.name).join(', ');
  }
}

