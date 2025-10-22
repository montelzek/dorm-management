import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {AdminReservationService} from './services/admin-reservation.service';
import {ReservationListComponent} from './components/reservation-list/reservation-list';
import {MainLayoutComponent} from '../../../shared/components/layout/main-layout/main-layout';
import {UserService} from '../../../core/services/user.service';
import {FormsModule} from '@angular/forms';
import {ReservationDetailsModalComponent} from './components/reservation-details-modal/reservation-details-modal';
import {ConfirmationDialogComponent} from '../residents-management/components/confirmation-dialog/confirmation-dialog';
import {AdminReservation} from './models/admin-reservation.models';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-reservations-management',
  imports: [
    ReservationListComponent,
    MainLayoutComponent,
    FormsModule,
    ReservationDetailsModalComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './reservations-management.html'
})
export class ReservationsManagementComponent implements OnInit {

  private readonly reservationService = inject(AdminReservationService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly allReservations = this.reservationService.allReservations;
  readonly buildings = this.reservationService.buildings;
  readonly resources = this.reservationService.resources;
  readonly currentUser = this.userService.currentUser;
  readonly totalElements = this.reservationService.totalElements;
  readonly totalPages = this.reservationService.totalPages;
  readonly currentPage = this.reservationService.currentPage;
  readonly pageSize = this.reservationService.pageSize;

  readonly selectedResourceId = signal<string>('');
  readonly selectedBuildingId = signal<string>('');
  readonly selectedDate = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly page = signal<number>(0);
  readonly size = signal<number>(10);
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly isDetailsModalOpen = signal<boolean>(false);
  readonly selectedReservation = signal<AdminReservation | null>(null);
  readonly isCancelDialogOpen = signal<boolean>(false);
  readonly reservationToCancel = signal<AdminReservation | null>(null);
  readonly isLoading = signal<boolean>(false);

  ngOnInit() {
    this.userService.loadCurrentUser();
    this.loadReservations();
    this.reservationService.getBuildings();
  }

  private loadReservations() {
    this.isLoading.set(true);
    const resourceId = this.selectedResourceId();
    const buildingId = this.selectedBuildingId();
    const date = this.selectedDate();
    const page = this.page();
    const size = this.size();
    const search = this.searchQuery().trim() || undefined;
    const sortDirection = this.sortDirection();
    
    setTimeout(() => {
      this.reservationService.getAdminReservations(
        page, 
        size, 
        sortDirection,
        resourceId || undefined,
        buildingId || undefined,
        date || undefined,
        search
      );
      this.isLoading.set(false);
    }, 300);
  }

  onResourceFilterChange(resourceId: string) {
    this.selectedResourceId.set(resourceId);
    this.page.set(0);
    this.loadReservations();
  }

  onBuildingFilterChange(buildingId: string) {
    this.selectedBuildingId.set(buildingId);
    this.page.set(0);
    
    // Load resources for selected building
    if (buildingId) {
      this.reservationService.getResources(buildingId);
    } else {
      this.reservationService.resources.set([]);
    }
    
    // Reset resource filter
    this.selectedResourceId.set('');
    this.loadReservations();
  }

  onDateFilterChange(date: string) {
    this.selectedDate.set(date);
    this.page.set(0);
    this.loadReservations();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.page.set(0);
    this.loadReservations();
  }

  onSortDirectionChange() {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    this.loadReservations();
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadReservations();
  }

  onPageSizeChange(newSize: number) {
    this.size.set(newSize);
    this.page.set(0);
    this.loadReservations();
  }

  onViewDetails(reservation: AdminReservation) {
    this.selectedReservation.set(reservation);
    this.isDetailsModalOpen.set(true);
  }

  onCloseDetailsModal() {
    this.isDetailsModalOpen.set(false);
    this.selectedReservation.set(null);
  }

  onCancelReservation(reservation: AdminReservation) {
    this.reservationToCancel.set(reservation);
    this.isCancelDialogOpen.set(true);
  }

  onCancelDialogClose() {
    this.isCancelDialogOpen.set(false);
    this.reservationToCancel.set(null);
  }

  onConfirmCancel() {
    const reservation = this.reservationToCancel();
    if (!reservation) return;

    this.reservationService.cancelReservation(reservation.id).subscribe({
      next: () => {
        this.toastService.showSuccess(`Reservation for ${reservation.firstName} ${reservation.lastName} cancelled successfully`);
        this.isCancelDialogOpen.set(false);
        this.reservationToCancel.set(null);
        this.loadReservations();
      },
      error: (err) => {
        console.error('Error cancelling reservation:', err);
        this.toastService.showError('Failed to cancel reservation');
      }
    });
  }

}

