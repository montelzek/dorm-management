import { inject, Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, take } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import {
  GET_ADMIN_BUILDINGS,
  CREATE_BUILDING,
  UPDATE_BUILDING,
  DELETE_BUILDING,
  GET_ADMIN_ROOMS,
  CREATE_ROOM,
  UPDATE_ROOM,
  DELETE_ROOM,
  GET_ADMIN_RESOURCES,
  CREATE_RESOURCE,
  UPDATE_RESOURCE,
  TOGGLE_RESOURCE_STATUS,
  GET_ALL_BUILDINGS,
  GET_ADMIN_ROOM_STANDARDS,
  CREATE_ROOM_STANDARD,
  UPDATE_ROOM_STANDARD,
  DELETE_ROOM_STANDARD,
  DELETE_RESOURCE
} from '../facilities.graphql';

export interface Building {
  id: string;
  name: string;
  address: string;
  roomsCount: number;
  resourcesCount: number;
  createdAt: string;
}

export interface BuildingDetails extends Building {
  updatedAt: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  buildingId: string;
  buildingName: string;
  capacity: number;
  occupancy: number;
  standardId?: string;
  standardName?: string;
  standardCapacity?: number;
  standardPrice?: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  name: string;
  description: string | null;
  resourceType: string;
  buildingId: string;
  buildingName: string;
  isActive: boolean;
  createdAt: string;
}

export interface SimpleBuild {
  id: string;
  name: string;
}

export interface CreateBuildingInput {
  name: string;
  address: string;
}

export interface CreateRoomInput {
  roomNumber: string;
  buildingId: string;
  capacity: number;
  standardId: string;
}

export interface CreateResourceInput {
  name: string;
  description: string | null;
  buildingId: string;
  isActive: boolean;
}

export interface RoomStandard {
  id: string;
  code?: string;
  name: string;
  capacity: number;
  price: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoomStandardInput {
  name: string;
  capacity: number;
  price: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacilitiesService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  // Buildings state
  private readonly _buildings = signal<Building[]>([]);
  private readonly _buildingsTotalElements = signal<number>(0);
  private readonly _buildingsTotalPages = signal<number>(0);
  private readonly _buildingsCurrentPage = signal<number>(0);
  private readonly _buildingsPageSize = signal<number>(10);

  // Rooms state
  private readonly _rooms = signal<Room[]>([]);
  private readonly _roomsTotalElements = signal<number>(0);
  private readonly _roomsTotalPages = signal<number>(0);
  private readonly _roomsCurrentPage = signal<number>(0);
  private readonly _roomsPageSize = signal<number>(10);

  // Resources state
  private readonly _resources = signal<Resource[]>([]);
  private readonly _resourcesTotalElements = signal<number>(0);
  private readonly _resourcesTotalPages = signal<number>(0);
  private readonly _resourcesCurrentPage = signal<number>(0);
  private readonly _resourcesPageSize = signal<number>(10);

  // Room standards state
  private readonly _roomStandards = signal<RoomStandard[]>([]);
  private readonly _roomStandardsTotalElements = signal<number>(0);
  private readonly _roomStandardsTotalPages = signal<number>(0);
  private readonly _roomStandardsCurrentPage = signal<number>(0);
  private readonly _roomStandardsPageSize = signal<number>(10);

  // All buildings for dropdowns
  private readonly _allBuildings = signal<SimpleBuild[]>([]);

  // Loading states
  private readonly _buildingsLoading = signal<boolean>(false);
  private readonly _roomsLoading = signal<boolean>(false);
  private readonly _resourcesLoading = signal<boolean>(false);
  private readonly _roomStandardsLoading = signal<boolean>(false);

  // Public computed signals
  readonly buildings = computed(() => this._buildings());
  readonly buildingsTotalElements = computed(() => this._buildingsTotalElements());
  readonly buildingsTotalPages = computed(() => this._buildingsTotalPages());
  readonly buildingsCurrentPage = computed(() => this._buildingsCurrentPage());
  readonly buildingsPageSize = computed(() => this._buildingsPageSize());

  readonly rooms = computed(() => this._rooms());
  readonly roomsTotalElements = computed(() => this._roomsTotalElements());
  readonly roomsTotalPages = computed(() => this._roomsTotalPages());
  readonly roomsCurrentPage = computed(() => this._roomsCurrentPage());
  readonly roomsPageSize = computed(() => this._roomsPageSize());

  readonly resources = computed(() => this._resources());
  readonly resourcesTotalElements = computed(() => this._resourcesTotalElements());
  readonly resourcesTotalPages = computed(() => this._resourcesTotalPages());
  readonly resourcesCurrentPage = computed(() => this._resourcesCurrentPage());
  readonly resourcesPageSize = computed(() => this._resourcesPageSize());

  readonly roomStandards = computed(() => this._roomStandards());
  readonly roomStandardsTotalElements = computed(() => this._roomStandardsTotalElements());
  readonly roomStandardsTotalPages = computed(() => this._roomStandardsTotalPages());
  readonly roomStandardsCurrentPage = computed(() => this._roomStandardsCurrentPage());
  readonly roomStandardsPageSize = computed(() => this._roomStandardsPageSize());

  readonly allBuildings = computed(() => this._allBuildings());

  readonly buildingsLoading = computed(() => this._buildingsLoading());
  readonly roomsLoading = computed(() => this._roomsLoading());
  readonly resourcesLoading = computed(() => this._resourcesLoading());
  readonly roomStandardsLoading = computed(() => this._roomStandardsLoading());

  // Buildings Methods
  getBuildings(page: number = 0, size: number = 10): void {
    this._buildingsLoading.set(true);
    this.apollo.watchQuery<{ adminBuildings: any }>({
      query: GET_ADMIN_BUILDINGS,
      variables: { page, size },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.adminBuildings),
      tap(() => this._buildingsLoading.set(false)),
      catchError(error => {
        this._buildingsLoading.set(false);
        this.toastService.showError(this.translateService.instant('facilities.errorLoadingBuildings') + ': ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._buildings.set(response.content);
      this._buildingsTotalElements.set(response.totalElements);
      this._buildingsTotalPages.set(response.totalPages);
      this._buildingsCurrentPage.set(response.currentPage);
      this._buildingsPageSize.set(response.pageSize);
    });
  }

  createBuilding(input: CreateBuildingInput): Observable<Building> {
    return this.apollo.mutate<{ createBuilding: Building }>({
      mutation: CREATE_BUILDING,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to create building');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.buildingCreatedSuccess'));
        return result.data.createBuilding;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorCreatingBuilding') + ': ' + error.message);
        throw error;
      })
    );
  }

  updateBuilding(id: string, input: CreateBuildingInput): Observable<Building> {
    return this.apollo.mutate<{ updateBuilding: Building }>({
      mutation: UPDATE_BUILDING,
      variables: { id, input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to update building');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.buildingUpdatedSuccess'));
        return result.data.updateBuilding;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorUpdatingBuilding') + ': ' + error.message);
        throw error;
      })
    );
  }

  deleteBuilding(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteBuilding: boolean }>({
      mutation: DELETE_BUILDING,
      variables: { id },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }).pipe(
      take(1),
      map(result => {
        const success = result.data?.deleteBuilding ?? false;
        if (success) {
          this.toastService.showSuccess(this.translateService.instant('facilities.buildingDeletedSuccess'));
        }
        return success;
      }),
      catchError(error => {
        console.error('Delete building error:', error);
        const errorMsg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
        this.toastService.showError(this.translateService.instant('facilities.errorDeletingBuilding') + ': ' + errorMsg);
        return of(false);
      })
    );
  }

  // Rooms Methods
  getRooms(page: number = 0, size: number = 10, buildingId?: string, status?: string, search?: string): void {
    this._roomsLoading.set(true);
    this.apollo.watchQuery<{ adminRooms: any }>({
      query: GET_ADMIN_ROOMS,
      variables: {
        page,
        size,
        buildingId: buildingId || null,
        status: status || null,
        search: search || null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.adminRooms),
      tap(() => this._roomsLoading.set(false)),
      catchError(error => {
        this._roomsLoading.set(false);
        this.toastService.showError(this.translateService.instant('facilities.errorLoadingRooms') + ': ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._rooms.set(response.content);
      this._roomsTotalElements.set(response.totalElements);
      this._roomsTotalPages.set(response.totalPages);
      this._roomsCurrentPage.set(response.currentPage);
      this._roomsPageSize.set(response.pageSize);
    });
  }

  createRoom(input: CreateRoomInput): Observable<Room> {
    return this.apollo.mutate<{ createRoom: Room }>({
      mutation: CREATE_ROOM,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to create room');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.roomCreatedSuccess'));
        return result.data.createRoom;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorCreatingRoom') + ': ' + error.message);
        throw error;
      })
    );
  }

  updateRoom(id: string, input: CreateRoomInput): Observable<Room> {
    return this.apollo.mutate<{ updateRoom: Room }>({
      mutation: UPDATE_ROOM,
      variables: { id, input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to update room');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.roomUpdatedSuccess'));
        return result.data.updateRoom;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorUpdatingRoom') + ': ' + error.message);
        throw error;
      })
    );
  }

  deleteRoom(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteRoom: boolean }>({
      mutation: DELETE_ROOM,
      variables: { id },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }).pipe(
      take(1),
      map(result => {
        const success = result.data?.deleteRoom ?? false;
        if (success) {
          this.toastService.showSuccess(this.translateService.instant('facilities.roomDeletedSuccess'));
        }
        return success;
      }),
      catchError(error => {
        console.error('Delete room error:', error);
        const errorMsg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
        this.toastService.showError(this.translateService.instant('facilities.errorDeletingRoom') + ': ' + errorMsg);
        return of(false);
      })
    );
  }

  // Resources Methods
  getResources(page: number = 0, size: number = 10, buildingId?: string, isActive?: boolean): void {
    this._resourcesLoading.set(true);
    this.apollo.watchQuery<{ adminReservationResources: any }>({
      query: GET_ADMIN_RESOURCES,
      variables: {
        page,
        size,
        buildingId: buildingId || null,
        isActive: isActive !== undefined ? isActive : null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.adminReservationResources),
      tap(() => this._resourcesLoading.set(false)),
      catchError(error => {
        this._resourcesLoading.set(false);
        this.toastService.showError(this.translateService.instant('facilities.errorLoadingSpaces') + ': ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._resources.set(response.content);
      this._resourcesTotalElements.set(response.totalElements);
      this._resourcesTotalPages.set(response.totalPages);
      this._resourcesCurrentPage.set(response.currentPage);
      this._resourcesPageSize.set(response.pageSize);
    });
  }

  createResource(input: CreateResourceInput): Observable<Resource> {
    return this.apollo.mutate<{ createReservationResource: Resource }>({
      mutation: CREATE_RESOURCE,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to create common space');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.spaceCreatedSuccess'));
        return result.data.createReservationResource;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorCreatingSpace') + ': ' + error.message);
        throw error;
      })
    );
  }

  updateResource(id: string, input: CreateResourceInput): Observable<Resource> {
    return this.apollo.mutate<{ updateReservationResource: Resource }>({
      mutation: UPDATE_RESOURCE,
      variables: { id, input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to update common space');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.spaceUpdatedSuccess'));
        return result.data.updateReservationResource;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorUpdatingSpace') + ': ' + error.message);
        throw error;
      })
    );
  }

  toggleResourceStatus(id: string): Observable<Resource> {
    return this.apollo.mutate<{ toggleResourceStatus: Resource }>({
      mutation: TOGGLE_RESOURCE_STATUS,
      variables: { id }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to toggle status');
        }
        const newStatus = result.data.toggleResourceStatus.isActive ? 'activated' : 'deactivated';
        this.toastService.showSuccess(this.translateService.instant(newStatus === 'activated' ? 'facilities.spaceActivatedSuccess' : 'facilities.spaceDeactivatedSuccess'));
        return result.data.toggleResourceStatus;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorTogglingStatus') + ': ' + error.message);
        throw error;
      })
    );
  }

  deleteResource(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteReservationResource: boolean }>({
      mutation: DELETE_RESOURCE,
      variables: { id },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }).pipe(
      take(1),
      map(result => {
        const success = result.data?.deleteReservationResource ?? false;
        if (success) {
          this.toastService.showSuccess(this.translateService.instant('facilities.spaceDeletedSuccess'));
        }
        return success;
      }),
      catchError(error => {
        console.error('Delete space error:', error);
        const errorMsg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
        this.toastService.showError(this.translateService.instant('facilities.errorDeletingSpace') + ': ' + errorMsg);
        return of(false);
      })
    );
  }

  // Room Standards Methods
  getRoomStandards(page: number = 0, size: number = 10): void {
    this._roomStandardsLoading.set(true);
    this.apollo.watchQuery<{ adminRoomStandards: RoomStandard[] }>({
      query: GET_ADMIN_ROOM_STANDARDS,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.adminRoomStandards),
      tap(() => this._roomStandardsLoading.set(false)),
      catchError(error => {
        this._roomStandardsLoading.set(false);
        this.toastService.showError(this.translateService.instant('facilities.errorLoadingStandards') + ': ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._roomStandards.set(response || []);
    });
  }

  createRoomStandard(input: CreateRoomStandardInput): Observable<RoomStandard> {
    return this.apollo.mutate<{ createRoomStandard: RoomStandard }>({
      mutation: CREATE_ROOM_STANDARD,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to create room standard');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.standardCreatedSuccess'));
        return result.data.createRoomStandard;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorCreatingStandard') + ': ' + error.message);
        throw error;
      })
    );
  }

  updateRoomStandard(id: string, input: CreateRoomStandardInput): Observable<RoomStandard> {
    return this.apollo.mutate<{ updateRoomStandard: RoomStandard }>({
      mutation: UPDATE_ROOM_STANDARD,
      variables: { id, input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to update room standard');
        }
        this.toastService.showSuccess(this.translateService.instant('facilities.standardUpdatedSuccess'));
        return result.data.updateRoomStandard;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorUpdatingStandard') + ': ' + error.message);
        throw error;
      })
    );
  }

  deleteRoomStandard(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteRoomStandard: boolean }>({
      mutation: DELETE_ROOM_STANDARD,
      variables: { id },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }).pipe(
      take(1),
      map(result => {
        const success = result.data?.deleteRoomStandard ?? false;
        if (success) {
          this.toastService.showSuccess(this.translateService.instant('facilities.standardDeletedSuccess'));
        }
        return success;
      }),
      catchError(error => {
        console.error('Delete room standard error:', error);
        const errorMsg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
        this.toastService.showError(this.translateService.instant('facilities.errorDeletingStandard') + ': ' + errorMsg);
        return of(false);
      })
    );
  }

  // Get all buildings for dropdowns
  getAllBuildings(): void {
    this.apollo.watchQuery<{ allBuildings: SimpleBuild[] }>({
      query: GET_ALL_BUILDINGS,
      fetchPolicy: 'cache-first'
    }).valueChanges.pipe(
      map(result => result.data.allBuildings),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('facilities.errorLoadingBuildingsList') + ': ' + error.message);
        throw error;
      })
    ).subscribe(buildings => {
      this._allBuildings.set(buildings);
    });
  }
}
