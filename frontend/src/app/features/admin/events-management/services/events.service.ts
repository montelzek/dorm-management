import { inject, Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { map, catchError, tap, take } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import {
  GET_ADMIN_EVENTS,
  GET_RESIDENT_EVENTS,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT
} from '../events.graphql';

export interface EventBuilding {
  id: string;
  name: string;
}

export interface EventResource {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  building: EventBuilding | null;
  resource: EventResource | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  description: string | null;
  eventDate: string;
  startTime: string;
  endTime: string;
  buildingId: string | null;
  resourceId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);
  private readonly translateService = inject(TranslateService);

  // Events state
  private readonly _events = signal<Event[]>([]);
  private readonly _eventsTotalElements = signal<number>(0);
  private readonly _eventsTotalPages = signal<number>(0);
  private readonly _eventsCurrentPage = signal<number>(0);
  private readonly _eventsPageSize = signal<number>(10);

  // Loading state
  private readonly _eventsLoading = signal<boolean>(false);

  // Public computed signals
  readonly events = computed(() => this._events());
  readonly eventsTotalElements = computed(() => this._eventsTotalElements());
  readonly eventsTotalPages = computed(() => this._eventsTotalPages());
  readonly eventsCurrentPage = computed(() => this._eventsCurrentPage());
  readonly eventsPageSize = computed(() => this._eventsPageSize());
  readonly eventsLoading = computed(() => this._eventsLoading());

  // Admin Methods
  getEvents(page: number = 0, size: number = 20, buildingId?: string, startDate?: string, endDate?: string): void {
    this._eventsLoading.set(true);
    this.apollo.watchQuery<{ adminEvents: any }>({
      query: GET_ADMIN_EVENTS,
      variables: { 
        page, 
        size, 
        buildingId: buildingId || null,
        startDate: startDate || null,
        endDate: endDate || null
      },
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => result.data.adminEvents),
      tap(() => this._eventsLoading.set(false)),
      catchError(error => {
        this._eventsLoading.set(false);
        this.toastService.showError(this.translateService.instant('admin.errorLoadingEvents') + ': ' + error.message);
        throw error;
      })
    ).subscribe(response => {
      this._events.set(response.content);
      this._eventsTotalElements.set(response.totalElements);
      this._eventsTotalPages.set(response.totalPages);
      this._eventsCurrentPage.set(response.currentPage);
      this._eventsPageSize.set(response.pageSize);
    });
  }

  getEventsByDateRange(startDate: string, endDate: string): Observable<Event[]> {
    return this.apollo.query<{ residentEvents: Event[] }>({
      query: GET_RESIDENT_EVENTS,
      variables: { startDate, endDate },
      fetchPolicy: 'network-only'
    }).pipe(
      map(result => result.data.residentEvents),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('admin.errorLoadingEvents') + ': ' + error.message);
        return of([]);
      })
    );
  }

  createEvent(input: CreateEventInput): Observable<Event> {
    return this.apollo.mutate<{ createEvent: Event }>({
      mutation: CREATE_EVENT,
      variables: { input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to create event');
        }
        this.toastService.showSuccess(this.translateService.instant('admin.eventCreatedSuccess'));
        return result.data.createEvent;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('admin.errorCreatingEvent') + ': ' + error.message);
        throw error;
      })
    );
  }

  updateEvent(id: string, input: CreateEventInput): Observable<Event> {
    return this.apollo.mutate<{ updateEvent: Event }>({
      mutation: UPDATE_EVENT,
      variables: { id, input }
    }).pipe(
      map(result => {
        if (!result.data) {
          throw new Error('Failed to update event');
        }
        this.toastService.showSuccess(this.translateService.instant('admin.eventUpdatedSuccess'));
        return result.data.updateEvent;
      }),
      catchError(error => {
        this.toastService.showError(this.translateService.instant('admin.errorUpdatingEvent') + ': ' + error.message);
        throw error;
      })
    );
  }

  deleteEvent(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteEvent: boolean }>({
      mutation: DELETE_EVENT,
      variables: { id },
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }).pipe(
      take(1),
      map(result => {
        const success = result.data?.deleteEvent ?? false;
        if (success) {
          this.toastService.showSuccess(this.translateService.instant('admin.eventDeletedSuccess'));
        }
        return success;
      }),
      catchError(error => {
        const errorMsg = error?.graphQLErrors?.[0]?.message || error?.message || 'Unknown error';
        this.toastService.showError(this.translateService.instant('admin.errorDeletingEvent') + ': ' + errorMsg);
        return of(false);
      })
    );
  }
}

