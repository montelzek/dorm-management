import { Injectable, signal, computed, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { GET_MY_ISSUES, CREATE_ISSUE, CANCEL_ISSUE } from '../issues.graphql';

export interface IssueRoom {
  id: string;
  roomNumber: string;
}

export interface IssueBuilding {
  id: string;
  name: string;
}

export interface Issue {
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

export interface CreateIssueInput {
  title: string;
  description: string;
  priority: string;
}

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);

  private readonly _isLoading = signal<boolean>(false);
  private readonly _myIssues = signal<Issue[]>([]);

  readonly isLoading = computed(() => this._isLoading());
  readonly myIssues = computed(() => this._myIssues());

  loadMyIssues(status?: string): void {
    this.getMyIssues(status).subscribe();
  }

  getMyIssues(status?: string): Observable<Issue[]> {
    this._isLoading.set(true);

    return this.apollo.watchQuery<{ myIssues: Issue[] }>({
      query: GET_MY_ISSUES,
      variables: { status: status || null },
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).valueChanges.pipe(
      map(result => {
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Failed to load issues');
        }
        const issues = result.data.myIssues;
        this._myIssues.set(issues);
        this._isLoading.set(false);
        return issues;
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Error loading issues:', error);
        throw error;
      })
    );
  }

  createIssue(input: CreateIssueInput): Observable<Issue> {
    this._isLoading.set(true);

    return this.apollo.mutate<{ createIssue: Issue }>({
      mutation: CREATE_ISSUE,
      variables: { input },
      errorPolicy: 'all'
    }).pipe(
      map(result => {
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Failed to create issue');
        }
        this._isLoading.set(false);
        this.toastService.showSuccess('Issue reported successfully!');
        this.loadMyIssues();
        return result.data!.createIssue;
      }),
      catchError(error => {
        this._isLoading.set(false);
        throw error;
      })
    );
  }

  cancelIssue(issueId: string): Observable<boolean> {
    this._isLoading.set(true);

    return this.apollo.mutate<{ cancelIssue: boolean }>({
      mutation: CANCEL_ISSUE,
      variables: { issueId },
      errorPolicy: 'none'
    }).pipe(
      map(result => {
        this._isLoading.set(false);
        this.toastService.showSuccess('Issue cancelled successfully!');
        this.loadMyIssues();
        return result.data!.cancelIssue;
      }),
      catchError(error => {
        this._isLoading.set(false);
        console.error('Error cancelling issue:', error);
        throw error;
      })
    );
  }
}

