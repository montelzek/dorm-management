import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ResidentService } from './services/resident';
import { ResidentListComponent } from './components/resident-list/resident-list';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { RoomAssignmentModalComponent } from './components/room-assignment-modal/room-assignment-modal';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog';
import { ResidentPayload } from './models/resident.models';
import { ToastService } from '../../../core/services/toast.service';
import { ResidentFormModalComponent } from './components/resident-form-modal/resident-form-modal';
import { TechniciansListComponent } from './components/technicians-list/technicians-list';

@Component({
  selector: 'app-residents-management',
  imports: [
    ResidentListComponent,
    MainLayoutComponent,
    FormsModule,
    RoomAssignmentModalComponent,
    ResidentFormModalComponent,
    ConfirmationDialogComponent,
    TranslateModule,
    LowerCasePipe,
    TechniciansListComponent
  ],
  templateUrl: './residents-management.html'
})
export class ResidentsManagementComponent implements OnInit {

  private readonly residentService = inject(ResidentService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly allResidents = this.residentService.allResidents;
  readonly buildings = this.residentService.buildings;
  readonly currentUser = this.userService.currentUser;
  readonly totalElements = this.residentService.totalElements;
  readonly totalPages = this.residentService.totalPages;
  readonly currentPage = this.residentService.currentPage;
  readonly pageSize = this.residentService.pageSize;

  readonly selectedBuildingId = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly page = signal<number>(0);
  readonly size = signal<number>(10);
  readonly sortBy = signal<string>('firstName');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  readonly isModalOpen = signal<boolean>(false);
  readonly selectedResident = signal<ResidentPayload | null>(null);
  readonly isCreateModalOpen = signal<boolean>(false);
  readonly isDeleteDialogOpen = signal<boolean>(false);
  readonly residentToDelete = signal<ResidentPayload | null>(null);
  readonly isLoading = signal<boolean>(false);

  readonly activeTab = signal<'residents' | 'technicians'>('residents');

  ngOnInit() {
    this.userService.loadCurrentUser();
    this.loadResidents();
    this.residentService.getBuildings();
  }

  setActiveTab(tab: 'residents' | 'technicians') {
    this.activeTab.set(tab);
    if (tab === 'residents') {
      this.loadResidents();
    }
  }

  private loadResidents() {
    this.isLoading.set(true);
    const buildingId = this.selectedBuildingId();
    const page = this.page();
    const size = this.size();
    const search = this.searchQuery().trim() || undefined;
    const sortBy = this.sortBy();
    const sortDirection = this.sortDirection();

    setTimeout(() => {
      if (buildingId === '') {
        this.residentService.getAllResidents(page, size, search, sortBy, sortDirection);
      } else {
        this.residentService.getResidentsByBuilding(buildingId, page, size, search, sortBy, sortDirection);
      }
      this.isLoading.set(false);
    }, 300);
  }

  onBuildingFilterChange(buildingId: string) {
    this.selectedBuildingId.set(buildingId);
    this.page.set(0);
    this.loadResidents();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.page.set(0);
    this.loadResidents();
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadResidents();
  }

  onPageSizeChange(newSize: number) {
    this.size.set(newSize);
    this.page.set(0);
    this.loadResidents();
  }

  onSortChange(field: string) {
    if (this.sortBy() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(field);
      this.sortDirection.set('asc');
    }
    this.loadResidents();
  }

  onAssignRoom(resident: ResidentPayload) {
    this.selectedResident.set(resident);
    this.isModalOpen.set(true);
  }

  onModalClose() {
    this.isModalOpen.set(false);
    this.selectedResident.set(null);
  }

  onRoomAssigned() {
    this.loadResidents(); // Reload the residents list
  }

  onDeleteResident(resident: ResidentPayload) {
    this.residentToDelete.set(resident);
    this.isDeleteDialogOpen.set(true);
  }

  onCancelDelete() {
    this.isDeleteDialogOpen.set(false);
    this.residentToDelete.set(null);
  }

  onConfirmDelete() {
    const resident = this.residentToDelete();
    if (!resident) return;

    this.residentService.deleteResident(resident.id).subscribe({
      next: () => {
        this.toastService.showSuccess('toast.success.residentDeleted');
        this.isDeleteDialogOpen.set(false);
        this.residentToDelete.set(null);
        this.loadResidents();
      },
      error: (err) => {
        console.error('Error deleting resident:', err);
        this.toastService.showError('toast.error.deletingResident');
      }
    });
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  onResidentSubmit(data: any) {
    this.residentService.createResident(data).subscribe({
      next: () => {
        this.toastService.showSuccess('toast.success.residentCreated');
        this.closeCreateModal();
        this.loadResidents();
      },
      error: (error) => {
        console.error('Error creating resident:', error);
        const errorMsg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
        if (errorMsg.includes('Email already exists')) {
          this.toastService.showError('toast.error.emailExists');
        } else {
          this.toastService.showError('toast.error.creatingResident');
        }
      }
    });
  }
}
