import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ResidentService} from './services/resident';
import {ResidentListComponent} from './components/resident-list/resident-list';
import {MainLayoutComponent} from '../../../shared/components/layout/main-layout/main-layout';
import {UserService} from '../../../core/services/user.service';
import {FormsModule} from '@angular/forms';
import {RoomAssignmentModalComponent} from './components/room-assignment-modal/room-assignment-modal';
import {ConfirmationDialogComponent} from './components/confirmation-dialog/confirmation-dialog';
import {ResidentPayload} from './models/resident.models';
import {ToastService} from '../../../core/services/toast.service';

@Component({
  selector: 'app-residents-management',
  imports: [
    ResidentListComponent,
    MainLayoutComponent,
    FormsModule,
    RoomAssignmentModalComponent,
    ConfirmationDialogComponent
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

  readonly isModalOpen = signal<boolean>(false);
  readonly selectedResident = signal<ResidentPayload | null>(null);
  readonly isDeleteDialogOpen = signal<boolean>(false);
  readonly residentToDelete = signal<ResidentPayload | null>(null);
  readonly isLoading = signal<boolean>(false);

  readonly filteredResidents = computed(() => {
    const residents = this.allResidents();
    const query = this.searchQuery().toLowerCase().trim();

    if (!query) {
      return residents;
    }

    return residents.filter(resident =>
      resident.firstName.toLowerCase().includes(query) ||
      resident.lastName.toLowerCase().includes(query) ||
      resident.roomNumber.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.userService.loadCurrentUser();
    this.loadResidents();
    this.residentService.getBuildings();
  }

  private loadResidents() {
    this.isLoading.set(true);
    const buildingId = this.selectedBuildingId();
    const page = this.page();
    const size = this.size();
    
    // Small delay to show that loading is happening
    setTimeout(() => {
      if (buildingId === '') {
        this.residentService.getAllResidents(page, size);
      } else {
        this.residentService.getResidentsByBuilding(buildingId, page, size);
      }
      this.isLoading.set(false);
    }, 300);
  }

  onBuildingFilterChange(buildingId: string) {
    this.selectedBuildingId.set(buildingId);
    this.page.set(0); // Reset to first page
    this.loadResidents();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.loadResidents();
  }

  onPageSizeChange(newSize: number) {
    this.size.set(newSize);
    this.page.set(0); // Reset to first page
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
        this.toastService.showSuccess(`Resident ${resident.firstName} ${resident.lastName} deleted successfully`);
        this.isDeleteDialogOpen.set(false);
        this.residentToDelete.set(null);
        this.loadResidents();
      },
      error: (err) => {
        console.error('Error deleting resident:', err);
        this.toastService.showError('Failed to delete resident');
      }
    });
  }

}
