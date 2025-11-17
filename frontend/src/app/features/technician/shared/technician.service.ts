import { inject, Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ToastService } from '../../../core/services/toast.service';
import { 
  GET_MY_ASSIGNED_TASKS, 
  GET_MY_TASKS_HISTORY, 
  GET_TECHNICIAN_DASHBOARD_STATS, 
  UPDATE_TASK_STATUS,
  GET_BUILDINGS
} from './technician.graphql';

export interface TaskUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface TaskRoom {
  id: string;
  roomNumber: string;
}

export interface TaskBuilding {
  id: string;
  name: string;
}

export interface TechnicianTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: TaskUser;
  room?: TaskRoom;
  building?: TaskBuilding;
}

export interface Building {
  id: string;
  name: string;
}

export interface DashboardStats {
  activeTasks: number;
  resolvedTasks: number;
  inProgressTasks: number;
  reportedTasks: number;
  highPriorityTasks: number;
  urgentPriorityTasks: number;
}

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);

  private readonly _assignedTasks = signal<TechnicianTask[]>([]);
  private readonly _tasksHistory = signal<TechnicianTask[]>([]);
  private readonly _dashboardStats = signal<DashboardStats | null>(null);
  private readonly _buildings = signal<Building[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  
  // Pagination for assigned tasks
  private readonly _totalElements = signal<number>(0);
  private readonly _totalPages = signal<number>(0);
  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(10);
  
  // Pagination for history
  private readonly _historyTotalElements = signal<number>(0);
  private readonly _historyTotalPages = signal<number>(0);
  private readonly _historyCurrentPage = signal<number>(0);
  private readonly _historyPageSize = signal<number>(10);

  readonly assignedTasks = computed(() => this._assignedTasks());
  readonly tasksHistory = computed(() => this._tasksHistory());
  readonly dashboardStats = computed(() => this._dashboardStats());
  readonly buildings = computed(() => this._buildings());
  readonly isLoading = computed(() => this._isLoading());
  
  readonly totalElements = computed(() => this._totalElements());
  readonly totalPages = computed(() => this._totalPages());
  readonly currentPage = computed(() => this._currentPage());
  readonly pageSize = computed(() => this._pageSize());
  
  readonly historyTotalElements = computed(() => this._historyTotalElements());
  readonly historyTotalPages = computed(() => this._historyTotalPages());
  readonly historyCurrentPage = computed(() => this._historyCurrentPage());
  readonly historyPageSize = computed(() => this._historyPageSize());

  getMyAssignedTasks(page: number = 0, size: number = 10, status?: string): void {
    this._isLoading.set(true);
    this.apollo.watchQuery<{ myAssignedTasks: any }>({
      query: GET_MY_ASSIGNED_TASKS,
      variables: { 
        page, 
        size, 
        status: status || null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.myAssignedTasks),
      tap(() => this._isLoading.set(false)),
      catchError(error => {
        this._isLoading.set(false);
        this.toastService.showError('Error loading tasks: ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._assignedTasks.set(response.content);
      this._totalElements.set(response.totalElements);
      this._totalPages.set(response.totalPages);
      this._currentPage.set(response.currentPage);
      this._pageSize.set(response.pageSize);
    });
  }

  getMyTasksHistory(page: number = 0, size: number = 10, buildingId?: string): void {
    this._isLoading.set(true);
    this.apollo.watchQuery<{ myTasksHistory: any }>({
      query: GET_MY_TASKS_HISTORY,
      variables: { 
        page, 
        size, 
        buildingId: buildingId || null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.myTasksHistory),
      tap(() => this._isLoading.set(false)),
      catchError(error => {
        this._isLoading.set(false);
        this.toastService.showError('Error loading history: ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._tasksHistory.set(response.content);
      this._historyTotalElements.set(response.totalElements);
      this._historyTotalPages.set(response.totalPages);
      this._historyCurrentPage.set(response.currentPage);
      this._historyPageSize.set(response.pageSize);
    });
  }

  getDashboardStats(): void {
    this._isLoading.set(true);
    this.apollo.watchQuery<{ technicianDashboardStats: DashboardStats }>({
      query: GET_TECHNICIAN_DASHBOARD_STATS,
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.technicianDashboardStats),
      tap(() => this._isLoading.set(false)),
      catchError(error => {
        this._isLoading.set(false);
        this.toastService.showError('Error loading stats: ' + error.message);
        throw error;
      })
    ).subscribe(stats => {
      this._dashboardStats.set(stats);
    });
  }

  getBuildings(): void {
    this.apollo.watchQuery<{ allBuildings: Building[] }>({
      query: GET_BUILDINGS,
      fetchPolicy: 'cache-first'
    }).valueChanges.pipe(
      map(result => result.data.allBuildings),
      catchError(error => {
        this.toastService.showError('Error loading buildings: ' + error.message);
        throw error;
      })
    ).subscribe(buildings => {
      this._buildings.set(buildings);
    });
  }

  updateTaskStatus(issueId: string, newStatus: string): Observable<TechnicianTask> {
    this._isLoading.set(true);
    return this.apollo.mutate<{ updateTaskStatus: TechnicianTask }>({
      mutation: UPDATE_TASK_STATUS,
      variables: { issueId, status: newStatus }
    }).pipe(
      map(result => {
        this._isLoading.set(false);
        if (!result.data) {
          throw new Error('Failed to update task status');
        }
        return result.data.updateTaskStatus;
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.toastService.showError('Error updating status: ' + error.message);
        throw error;
      })
    );
  }
}
