import { Injectable, signal, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_RESIDENT_DASHBOARD } from '../dashboard.graphql';
import { UserService } from '../../../../core/services/user.service';
import { Subscription } from 'rxjs';

export interface ResidentUserInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  roomNumber: string | null;
  buildingName: string | null;
}

export interface ResidentStats {
  totalReservations: number;
  totalIssues: number;
  activeListings: number;
}

export interface ReservationResource {
  id: string;
  name: string;
  resourceType: string;
}

export interface ReservationUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  building: {
    id: string;
    name: string;
  } | null;
}

export interface MyReservation {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  resource: ReservationResource;
  user: ReservationUser;
}

export interface IssueRoom {
  id: string;
  roomNumber: string;
}

export interface IssueBuilding {
  id: string;
  name: string;
}

export interface MyIssue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  room: IssueRoom | null;
  building: IssueBuilding | null;
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

export interface ContactInfo {
  email: string;
  phone: string | null;
  firstName: string;
  lastName: string;
}

export interface MyListing {
  id: string;
  title: string;
  description: string;
  listingType: string;
  category: string;
  price: number;
  imageFilenames: string[];
  contactInfo: ContactInfo;
  createdAt: string;
  updatedAt: string;
  isOwnListing: boolean;
}

export interface ResidentDashboardData {
  userInfo: ResidentUserInfo;
  stats: ResidentStats;
  myActiveReservations: MyReservation[];
  myIssues: MyIssue[];
  upcomingEvents: UpcomingEvent[];
  activeAnnouncements: ActiveAnnouncement[];
  myActiveListings: MyListing[];
}

@Injectable()
export class ResidentDashboardService {
  private readonly apollo = inject(Apollo);
  private readonly userService = inject(UserService);

  dashboardData = signal<ResidentDashboardData | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private querySub: Subscription | null = null;

  loadResidentDashboard(): void {
    // CRITICAL: Do NOT load if user is not a resident
    const currentUser = this.userService.currentUser();
    if (!currentUser) {
      console.warn('[ResidentDashboardService] No user loaded, skipping dashboard load');
      return;
    }

    if (currentUser.role !== 'ROLE_RESIDENT') {
      console.warn('[ResidentDashboardService] User is not a resident, skipping dashboard load. Role:', currentUser.role);
      this.error.set('Access denied: This dashboard is for residents only');
      return;
    }

    console.log('[ResidentDashboardService] Loading dashboard for resident:', currentUser.firstName);
    this.isLoading.set(true);
    this.error.set(null);

    // unsubscribe previous subscription if exists
    if (this.querySub) {
      try { this.querySub.unsubscribe(); } catch (e) { /* ignore */ }
      this.querySub = null;
    }

    const observable = this.apollo
      .watchQuery<{ residentDashboard: ResidentDashboardData }>({
        query: GET_RESIDENT_DASHBOARD,
        fetchPolicy: 'network-only'
      })
      .valueChanges;

    // subscribe and keep reference for unsubscribe
    this.querySub = observable.subscribe({
      next: ({ data, loading }) => {
        this.isLoading.set(loading);
        if (data?.residentDashboard) {
          this.dashboardData.set(data.residentDashboard);
        }
      },
      error: (err) => {
        console.error('[ResidentDashboardService] Error loading dashboard:', err);
        this.error.set('Failed to load dashboard data');
        this.isLoading.set(false);
      }
    });
  }
}
