import { Injectable, signal, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_ADMIN_DASHBOARD } from '../dashboard.graphql';
import { UserService } from '../../../../core/services/user.service';

export interface AdminDashboardStats {
  totalResidents: number;
  totalRooms: number;
  totalBuildings: number;
  occupiedRooms: number;
  availableRooms: number;
  totalReservations: number;
  totalIssues: number;
}

export interface IssueStats {
  reported: number;
  inProgress: number;
  resolved: number;
  lowPriority: number;
  mediumPriority: number;
  highPriority: number;
}

export interface RecentIssue {
  id: string;
  title: string;
  status: string;
  priority: string;
  userName: string;
  buildingName: string | null;
  createdAt: string;
}

export interface EventBuilding {
  id: string;
  name: string;
}

export interface EventResource {
  id: string;
  name: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  building: EventBuilding | null;
  resource: EventResource | null;
}

export interface RecentReservation {
  id: string;
  userName: string;
  resourceName: string;
  buildingName: string | null;
  startTime: string;
  endTime: string;
  status: string;
}

export interface AnnouncementBuilding {
  id: string;
  name: string;
}

export interface ActiveAnnouncement {
  id: string;
  title: string;
  content: string;
  category: string;
  startDate: string;
  endDate: string;
  buildings: AnnouncementBuilding[];
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  issueStats: IssueStats;
  recentIssues: RecentIssue[];
  upcomingEvents: UpcomingEvent[];
  recentReservations: RecentReservation[];
  activeAnnouncements: ActiveAnnouncement[];
}

@Injectable()
export class AdminDashboardService {
  private readonly apollo = inject(Apollo);
  private readonly userService = inject(UserService);

  dashboardData = signal<AdminDashboardData | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  loadAdminDashboard(): void {
    // CRITICAL: Do NOT load if user is not an admin
    const currentUser = this.userService.currentUser();
    if (!currentUser) {
      console.warn('[AdminDashboardService] No user loaded, skipping dashboard load');
      return;
    }
    
    if (currentUser.role !== 'ROLE_ADMIN') {
      console.warn('[AdminDashboardService] User is not an admin, skipping dashboard load. Role:', currentUser.role);
      this.error.set('Access denied: This dashboard is for admins only');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.apollo
      .watchQuery<{ adminDashboard: AdminDashboardData }>({
        query: GET_ADMIN_DASHBOARD,
        fetchPolicy: 'network-only'
      })
      .valueChanges.subscribe({
        next: ({ data, loading }) => {
          this.isLoading.set(loading);
          if (data?.adminDashboard) {
            this.dashboardData.set(data.adminDashboard);
          }
        },
        error: (err) => {
          console.error('[AdminDashboardService] Error loading dashboard:', err);
          this.error.set('Failed to load dashboard data');
          this.isLoading.set(false);
        }
      });
  }
}

