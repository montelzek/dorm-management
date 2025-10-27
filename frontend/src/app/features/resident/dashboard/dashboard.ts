import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { ResidentDashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MainLayoutComponent
  ],
  providers: [ResidentDashboardService],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dashboardService = inject(ResidentDashboardService);
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
      // react to user changes: load or clear dashboard depending on role
      if (user && user.role === 'ROLE_RESIDENT') {
        console.log('[ResidentDashboard] User loaded, loading dashboard for:', user.firstName, user.role);
        this.dashboardService.loadResidentDashboard();
      } else if (user && user.role !== 'ROLE_RESIDENT') {
        // different role, clear dashboard
        console.log('[ResidentDashboard] User is not resident, clearing dashboard. Role:', user.role);
        this.dashboardService.dashboardData.set(null);
        this.dashboardService.error.set(null);
      }
    });
  }

  ngOnInit(): void {
    console.log('[ResidentDashboard] Component initialized, loading user...');
    this.userService.loadCurrentUser();
  }

  getStatusBadgeColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'REPORTED':
        return 'bg-status-error text-white';
      case 'IN_PROGRESS':
        return 'bg-status-warning text-white';
      case 'RESOLVED':
        return 'bg-status-success text-white';
      case 'CONFIRMED':
        return 'bg-status-success text-white';
      case 'CANCELLED':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  getPriorityBadgeColor(priority: string): string {
    switch (priority.toUpperCase()) {
      case 'LOW':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'HIGH':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
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
      case 'TEXTBOOKS':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'FURNITURE':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'ELECTRONICS':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'OTHER':
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  }

  getListingTypeBadgeColor(type: string): string {
    return type.toUpperCase() === 'SELL'
      ? 'bg-green-100 text-green-800 border border-green-300'
      : 'bg-blue-100 text-blue-800 border border-blue-300';
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

  formatPrice(price: number): string {
    return `${price.toFixed(2)} PLN`;
  }

  navigateToReservations(): void {
    this.router.navigate(['/reservation']);
  }

  navigateToIssues(): void {
    this.router.navigate(['/issues']);
  }

  navigateToEvents(): void {
    this.router.navigate(['/events']);
  }

  navigateToAnnouncements(): void {
    this.router.navigate(['/announcements']);
  }

  navigateToMarketplace(): void {
    this.router.navigate(['/marketplace']);
  }
}
