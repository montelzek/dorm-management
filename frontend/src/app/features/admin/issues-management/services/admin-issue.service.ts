import { inject, Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { GET_ALL_ISSUES, UPDATE_ISSUE_STATUS, GET_BUILDINGS } from '../admin-issues.graphql';

export interface IssueUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface IssueRoom {
  id: string;
  roomNumber: string;
}

export interface IssueBuilding {
  id: string;
  name: string;
}

export interface AdminIssue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  user: IssueUser;
  room?: IssueRoom;
  building?: IssueBuilding;
}

export interface Building {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminIssueService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);

  private readonly _allIssues = signal<AdminIssue[]>([]);
  private readonly _buildings = signal<Building[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _totalElements = signal<number>(0);
  private readonly _totalPages = signal<number>(0);
  private readonly _currentPage = signal<number>(0);
  private readonly _pageSize = signal<number>(10);

  readonly allIssues = computed(() => this._allIssues());
  readonly buildings = computed(() => this._buildings());
  readonly isLoading = computed(() => this._isLoading());
  readonly totalElements = computed(() => this._totalElements());
  readonly totalPages = computed(() => this._totalPages());
  readonly currentPage = computed(() => this._currentPage());
  readonly pageSize = computed(() => this._pageSize());

  getAllIssues(page: number = 0, size: number = 10, status?: string, priority?: string, buildingId?: string): void {
    this._isLoading.set(true);
    this.apollo.watchQuery<{ allIssues: any }>({
      query: GET_ALL_ISSUES,
      variables: { 
        page, 
        size, 
        status: status || null, 
        priority: priority || null, 
        buildingId: buildingId || null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.allIssues),
      tap(() => this._isLoading.set(false)),
      catchError(error => {
        this._isLoading.set(false);
        this.toastService.showError('Error loading issues: ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._allIssues.set(response.content);
      this._totalElements.set(response.totalElements);
      this._totalPages.set(response.totalPages);
      this._currentPage.set(response.currentPage);
      this._pageSize.set(response.pageSize);
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

  updateStatus(issueId: string, newStatus: string): Observable<AdminIssue> {
    this._isLoading.set(true);
    return this.apollo.mutate<{ updateIssueStatus: AdminIssue }>({
      mutation: UPDATE_ISSUE_STATUS,
      variables: { issueId, status: newStatus }
    }).pipe(
      map(result => {
        this._isLoading.set(false);
        if (!result.data) {
          throw new Error('Failed to update issue status');
        }
        this.toastService.showSuccess('Issue status updated successfully!');
        return result.data.updateIssueStatus;
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.toastService.showError('Error updating status: ' + error.message);
        throw error;
      })
    );
  }
}

