import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { FacilitiesService, Building, Room, Resource, RoomStandard } from './services/facilities.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { BuildingsListComponent } from './components/buildings-list/buildings-list';
import { RoomsListComponent } from './components/rooms-list/rooms-list';
import { ResourcesListComponent } from './components/resources-list/resources-list';
import { BuildingFormModalComponent } from './components/building-form-modal/building-form-modal';
import { RoomFormModalComponent } from './components/room-form-modal/room-form-modal';
import { ResourceFormModalComponent } from './components/resource-form-modal/resource-form-modal';
import { DeleteConfirmationModalComponent } from './components/delete-confirmation-modal/delete-confirmation-modal';
import { RoomStandardsListComponent } from './components/room-standards-list/room-standards-list';
import { RoomStandardFormModalComponent } from './components/room-standard-form-modal/room-standard-form-modal';

type TabType = 'buildings' | 'rooms' | 'resources' | 'standards';

@Component({
  selector: 'app-facilities-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainLayoutComponent,
    ModalComponent,
    BuildingsListComponent,
    RoomsListComponent,
    ResourcesListComponent,
    BuildingFormModalComponent,
    RoomFormModalComponent,
    ResourceFormModalComponent,
    DeleteConfirmationModalComponent,
    RoomStandardsListComponent,
    RoomStandardFormModalComponent
  ],
  templateUrl: './facilities-management.html'
})
export class FacilitiesManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly facilitiesService = inject(FacilitiesService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly Math = Math;
  readonly currentUser = this.userService.currentUser;

  // State
  readonly activeTab = signal<TabType>('buildings');

  // Buildings state
  readonly buildings = this.facilitiesService.buildings;
  readonly buildingsLoading = this.facilitiesService.buildingsLoading;
  readonly buildingsCurrentPage = this.facilitiesService.buildingsCurrentPage;
  readonly buildingsPageSize = this.facilitiesService.buildingsPageSize;
  readonly buildingsTotalPages = this.facilitiesService.buildingsTotalPages;
  readonly buildingsTotalElements = this.facilitiesService.buildingsTotalElements;

  // Rooms state
  readonly rooms = this.facilitiesService.rooms;
  readonly roomsLoading = this.facilitiesService.roomsLoading;
  readonly roomsCurrentPage = this.facilitiesService.roomsCurrentPage;
  readonly roomsPageSize = this.facilitiesService.roomsPageSize;
  readonly roomsTotalPages = this.facilitiesService.roomsTotalPages;
  readonly roomsTotalElements = this.facilitiesService.roomsTotalElements;

  // Resources state
  readonly resources = this.facilitiesService.resources;
  readonly resourcesLoading = this.facilitiesService.resourcesLoading;
  readonly resourcesCurrentPage = this.facilitiesService.resourcesCurrentPage;
  readonly resourcesPageSize = this.facilitiesService.resourcesPageSize;
  readonly resourcesTotalPages = this.facilitiesService.resourcesTotalPages;
  readonly resourcesTotalElements = this.facilitiesService.resourcesTotalElements;

  // Room standards state
  readonly roomStandards = this.facilitiesService.roomStandards;
  readonly roomStandardsLoading = this.facilitiesService.roomStandardsLoading;

  // All buildings for dropdowns
  readonly allBuildings = this.facilitiesService.allBuildings;

  // Modal states
  readonly isBuildingModalOpen = signal<boolean>(false);
  readonly isRoomModalOpen = signal<boolean>(false);
  readonly isResourceModalOpen = signal<boolean>(false);
  readonly isDeleteModalOpen = signal<boolean>(false);
  readonly isStandardModalOpen = signal<boolean>(false);

  // Edit mode
  readonly isEditMode = signal<boolean>(false);
  readonly selectedBuilding = signal<Building | null>(null);
  readonly selectedRoom = signal<Room | null>(null);
  readonly selectedResource = signal<Resource | null>(null);
  readonly selectedStandard = signal<any | null>(null);
  readonly itemToDelete = signal<any>(null);
  readonly deleteItemType = signal<string>('');

  // Filters
  readonly roomsBuildingFilter = signal<string>('');
  readonly roomsStatusFilter = signal<string>('');
  readonly roomsSearchFilter = signal<string>('');
  readonly resourcesBuildingFilter = signal<string>('');
  readonly resourcesStatusFilter = signal<string>('');

  // Pagination
  readonly buildingsPage = signal<number>(0);
  readonly roomsPage = signal<number>(0);
  readonly resourcesPage = signal<number>(0);

  // Forms
  readonly buildingForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    address: ['', Validators.required]
  });

  readonly roomForm = this.fb.group({
    roomNumber: ['', [Validators.required, Validators.maxLength(20)]],
    buildingId: ['', Validators.required],
    capacity: [2, [Validators.required, Validators.min(1)]],
    standardId: ['', [Validators.required]]
  });

  readonly resourceForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: [''],
    buildingId: ['', Validators.required],
    isActive: [true]
  });

  readonly standardForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    capacity: [2, [Validators.required, Validators.min(1)]],
    price: ['', [Validators.required, Validators.min(0)]]
  });

  readonly cascadeWarning = computed(() => {
    const item = this.itemToDelete();
    if (item && this.deleteItemType() === 'building') {
      const building = item as Building;
      if (building.roomsCount > 0 || building.resourcesCount > 0) {
        return `This will attempt to delete ${building.roomsCount} room(s) and ${building.resourcesCount} common space(s). This may fail if rooms have assigned residents.`;
      }
    }
    if (item && this.deleteItemType() === 'room') {
      const room = item as Room;
      if (room.occupancy > 0) {
        return `This room has ${room.occupancy} resident(s) assigned and cannot be deleted.`;
      }
    }
    return '';
  });

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.facilitiesService.getAllBuildings();
    this.facilitiesService.getRoomStandards();
    this.loadBuildings();
    this.loadStandards();
  }

  // Tab switching
  switchTab(tab: TabType): void {
    this.activeTab.set(tab);
    if (tab === 'buildings') {
      this.loadBuildings();
    } else if (tab === 'rooms') {
      this.loadRooms();
    } else if (tab === 'resources') {
      this.loadResources();
    } else if (tab === 'standards') {
      this.loadStandards();
    }
  }

  // Buildings CRUD
  loadBuildings(): void {
    this.facilitiesService.getBuildings(this.buildingsPage(), 20);
  }

  openBuildingModal(building?: Building): void {
    if (building) {
      this.isEditMode.set(true);
      this.selectedBuilding.set(building);
      this.buildingForm.patchValue({
        name: building.name,
        address: building.address
      });
    } else {
      this.isEditMode.set(false);
      this.selectedBuilding.set(null);
      this.buildingForm.reset();
    }
    this.isBuildingModalOpen.set(true);
  }

  closeBuildingModal(): void {
    this.isBuildingModalOpen.set(false);
    this.buildingForm.reset();
    this.selectedBuilding.set(null);
  }

  onBuildingFormSubmit(): void {
    if (this.buildingForm.invalid) return;

    const formValue = this.buildingForm.getRawValue();
    const input = {
      name: formValue.name!,
      address: formValue.address!
    };

    const operation = this.isEditMode()
      ? this.facilitiesService.updateBuilding(this.selectedBuilding()!.id, input)
      : this.facilitiesService.createBuilding(input);

    operation.subscribe({
      next: () => {
        this.closeBuildingModal();
        this.loadBuildings();
        this.facilitiesService.getAllBuildings();
      },
      error: (error) => this.handleError(error)
    });
  }

  confirmDeleteBuilding(building: Building): void {
    this.itemToDelete.set(building);
    this.deleteItemType.set('building');
    this.isDeleteModalOpen.set(true);
  }

  // Rooms CRUD
  loadRooms(): void {
    const buildingId = this.roomsBuildingFilter() || undefined;
    const status = this.roomsStatusFilter() || undefined;
    const search = this.roomsSearchFilter() || undefined;
    this.facilitiesService.getRooms(this.roomsPage(), 10, buildingId, status, search);
  }

  openRoomModal(room?: Room): void {
    if (room) {
      this.isEditMode.set(true);
      this.selectedRoom.set(room);
      this.roomForm.patchValue({
        roomNumber: room.roomNumber,
        buildingId: room.buildingId,
        capacity: room.capacity,
        standardId: room.standardId
      });
    } else {
      this.isEditMode.set(false);
      this.selectedRoom.set(null);
      this.roomForm.reset({ capacity: 2, standardId: '' });
    }
    this.isRoomModalOpen.set(true);
  }

  closeRoomModal(): void {
    this.isRoomModalOpen.set(false);
    this.roomForm.reset();
    this.selectedRoom.set(null);
  }

  onRoomFormSubmit(): void {
    if (this.roomForm.invalid) return;

    const formValue = this.roomForm.getRawValue();
    const input = {
      roomNumber: formValue.roomNumber!,
      buildingId: formValue.buildingId!,
      capacity: formValue.capacity!,
      standardId: formValue.standardId!
    };

    const operation = this.isEditMode()
      ? this.facilitiesService.updateRoom(this.selectedRoom()!.id, input)
      : this.facilitiesService.createRoom(input);

    operation.subscribe({
      next: () => {
        this.closeRoomModal();
        this.loadRooms();
      },
      error: (error) => this.handleError(error)
    });
  }

  confirmDeleteRoom(room: Room): void {
    this.itemToDelete.set(room);
    this.deleteItemType.set('room');
    this.isDeleteModalOpen.set(true);
  }

  onRoomBuildingFilterChange(buildingId: string): void {
    this.roomsBuildingFilter.set(buildingId);
    this.roomsPage.set(0);
    this.loadRooms();
  }

  onRoomStatusFilterChange(status: string): void {
    this.roomsStatusFilter.set(status);
    this.roomsPage.set(0);
    this.loadRooms();
  }

  onRoomSearchChange(search: string): void {
    this.roomsSearchFilter.set(search);
    this.roomsPage.set(0);
    this.loadRooms();
  }

  onRoomsPageChange(page: number): void {
    this.roomsPage.set(page);
    this.loadRooms();
  }

  // Resources CRUD
  loadResources(): void {
    const buildingId = this.resourcesBuildingFilter() || undefined;
    const isActive = this.resourcesStatusFilter() === 'true' ? true :
                     this.resourcesStatusFilter() === 'false' ? false : undefined;
    this.facilitiesService.getResources(this.resourcesPage(), 10, buildingId, isActive);
  }

  openResourceModal(resource?: Resource): void {
    if (resource) {
      this.isEditMode.set(true);
      this.selectedResource.set(resource);
      this.resourceForm.patchValue({
        name: resource.name,
        description: resource.description,
        buildingId: resource.buildingId,
        isActive: resource.isActive
      });
    } else {
      this.isEditMode.set(false);
      this.selectedResource.set(null);
      this.resourceForm.reset({ isActive: true });
    }
    this.isResourceModalOpen.set(true);
  }

  closeResourceModal(): void {
    this.isResourceModalOpen.set(false);
    this.resourceForm.reset();
    this.selectedResource.set(null);
  }

  onResourceFormSubmit(): void {
    if (this.resourceForm.invalid) return;

    const formValue = this.resourceForm.getRawValue();
    const input = {
      name: formValue.name!,
      description: formValue.description || null,
      buildingId: formValue.buildingId!,
      isActive: formValue.isActive!
    };

    const operation = this.isEditMode()
      ? this.facilitiesService.updateResource(this.selectedResource()!.id, input)
      : this.facilitiesService.createResource(input);

    operation.subscribe({
      next: () => {
        this.closeResourceModal();
        this.loadResources();
      },
      error: (error) => this.handleError(error)
    });
  }

  toggleResourceStatus(resource: Resource): void {
    this.facilitiesService.toggleResourceStatus(resource.id).subscribe({
      next: () => this.loadResources(),
      error: (error) => this.handleError(error)
    });
  }

  onResourceBuildingFilterChange(buildingId: string): void {
    this.resourcesBuildingFilter.set(buildingId);
    this.resourcesPage.set(0);
    this.loadResources();
  }

  onResourceStatusFilterChange(status: string): void {
    this.resourcesStatusFilter.set(status);
    this.resourcesPage.set(0);
    this.loadResources();
  }

  onResourcesPageChange(page: number): void {
    this.resourcesPage.set(page);
    this.loadResources();
  }

  // Standards CRUD
  loadStandards(): void {
    this.facilitiesService.getRoomStandards();
  }

  openStandardModal(std?: any): void {
    if (std) {
      this.isEditMode.set(true);
      this.selectedStandard.set(std);
      this.standardForm.patchValue({
        name: std.name,
        capacity: std.capacity,
        price: std.price
      });
    } else {
      this.isEditMode.set(false);
      this.selectedStandard.set(null);
      this.standardForm.reset({ capacity: 2 });
    }
    this.isStandardModalOpen.set(true);
  }

  closeStandardModal(): void {
    this.isStandardModalOpen.set(false);
    this.standardForm.reset();
    this.selectedStandard.set(null);
  }

  onStandardFormSubmit(): void {
    if (this.standardForm.invalid) return;
    const formValue = this.standardForm.getRawValue();
    const input = {
      name: formValue.name!,
      capacity: formValue.capacity!,
      price: formValue.price!.toString()
    };

    const operation = this.isEditMode()
      ? this.facilitiesService.updateRoomStandard(this.selectedStandard()!.id, input)
      : this.facilitiesService.createRoomStandard(input);

    operation.subscribe({
      next: () => {
        this.closeStandardModal();
        this.loadStandards();
        this.facilitiesService.getRoomStandards();
      },
      error: (error) => this.handleError(error)
    });
  }

  confirmDeleteStandard(std: any): void {
    this.facilitiesService.deleteRoomStandard(std.id).subscribe({
      next: (success) => {
        if (success) {
          this.loadStandards();
        } else {
          // show a user friendly message
          this.toastService.showError('Nie można usunąć standardu. Sprawdź czy nie jest przypisany do pokoju.');
        }
      },
      error: (error) => {
        const msg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
        this.toastService.showError('Error deleting standard: ' + msg);
        this.handleError(error);
      }
    });
  }

  // Delete confirmation
  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.itemToDelete.set(null);
    this.deleteItemType.set('');
  }

  onConfirmDelete(): void {
    const item = this.itemToDelete();
    const type = this.deleteItemType();

    if (!item) return;

    let operation;
    if (type === 'building') {
      operation = this.facilitiesService.deleteBuilding(item.id);
    } else if (type === 'room') {
      operation = this.facilitiesService.deleteRoom(item.id);
    } else {
      return;
    }

    operation.subscribe({
      next: () => {
        this.closeDeleteModal();
        if (type === 'building') {
          this.loadBuildings();
          this.facilitiesService.getAllBuildings();
        } else if (type === 'room') {
          this.loadRooms();
        }
      },
      error: (error) => {
        this.closeDeleteModal();
        this.handleError(error);
      }
    });
  }

  getAvailableStandardsForCapacity(capacity?: number | null) {
    if (capacity == null) return this.roomStandards();
    return this.roomStandards().filter((s: any) => s.capacity === capacity);
  }

  private handleError(error: any): void {
    console.error('Operation error:', error);
    // Error already shown by service via toast
  }
}
