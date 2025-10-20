import { inject, Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';
import { ErrorService } from '../../../../core/services/error.service';
import { ToastService } from '../../../../core/services/toast.service';

import {
  Building,
  CreateReservationInput,
  ReservationPayload,
  ReservationResource,
  TimeSlot,
  User
} from '../../../../shared/models/graphql.types';
import {
  CANCEL_RESERVATION,
  CREATE_RESERVATION,
  GET_AVAILABLE_LAUNDRY_SLOTS,
  GET_AVAILABLE_STANDARD_SLOTS,
  GET_BUILDINGS,
  GET_MY_DETAILS,
  GET_MY_RESERVATIONS,
  GET_RESOURCES_BY_BUILDING
} from '../reservations.graphql';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly apollo = inject(Apollo);
  private errorService = inject(ErrorService);
  private toastService = inject(ToastService);

  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _buildings = signal<Building[]>([]);
  private readonly _myReservations = signal<ReservationPayload[]>([]);

  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());
  readonly currentUser = computed(() => this._currentUser());
  readonly buildings = computed(() => this._buildings());
  readonly myReservations = computed(() => this._myReservations());

  private createQueryObservable<T>(queryFn: () => Observable<T>): Observable<T> {
    this._isLoading.set(true);
    this._error.set(null);

    return queryFn().pipe(
      tap(() => this._isLoading.set(false)),
      catchError(error => {
        this._isLoading.set(false);
        const errorMessage = this.extractErrorMessage(error);
        this._error.set(errorMessage);
        throw error;
      }),
      shareReplay(1)
    );
  }

  getMyDetails(): Observable<User> {
    return this.createQueryObservable(() =>
      this.apollo.watchQuery<{ me: User }>({
        query: GET_MY_DETAILS,
        errorPolicy: 'all'
      }).valueChanges.pipe(
        map(result => {
          if (result.errors) {
            throw new Error(result.errors[0]?.message || 'Failed to load user details');
          }
          const user = result.data.me;
          this._currentUser.set(user);
          return user;
        })
      )
    );
  }

  getBuildings(): Observable<Building[]> {
    return this.createQueryObservable(() =>
      this.apollo.watchQuery<{ allBuildings: Building[] }>({
        query: GET_BUILDINGS,
        errorPolicy: 'all'
      }).valueChanges.pipe(
        map(result => {
          if (result.errors) {
            throw new Error(result.errors[0]?.message || 'Failed to load buildings');
          }
          const buildings = result.data.allBuildings;
          this._buildings.set(buildings);
          return buildings;
        })
      )
    );
  }

  getResources(buildingId: string): Observable<ReservationResource[]> {
    return this.apollo.watchQuery<{ resourcesByBuilding: ReservationResource[] }>({
      query: GET_RESOURCES_BY_BUILDING,
      variables: { buildingId },
      errorPolicy: 'all'
    }).valueChanges.pipe(
      map(result => {
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Failed to load resources');
        }
        return result.data.resourcesByBuilding;
      }),
      catchError(error => {
        console.error('Error loading resources:', error);
        throw error;
      })
    );
  }

      getAvailableLaundrySlots(resourceId: string, date: string): Observable<TimeSlot[]> {
        return this.apollo.watchQuery<{ availableLaundrySlots: TimeSlot[] }>({
          query: GET_AVAILABLE_LAUNDRY_SLOTS,
          variables: { resourceId, date },
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }).valueChanges.pipe(
          map(result => {
            if (result.errors) {
              throw new Error(result.errors[0]?.message || 'Failed to load laundry slots');
            }
            return result.data.availableLaundrySlots;
          }),
          catchError(error => {
            console.error('Error loading laundry slots:', error);
            throw error;
          })
        );
      }

      getAvailableStandardSlots(resourceId: string, date: string): Observable<TimeSlot[]> {
        return this.apollo.watchQuery<{ availableStandardSlots: TimeSlot[] }>({
          query: GET_AVAILABLE_STANDARD_SLOTS,
          variables: { resourceId, date },
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }).valueChanges.pipe(
          map(result => {
            if (result.errors) {
              throw new Error(result.errors[0]?.message || 'Failed to load standard slots');
            }
            return result.data.availableStandardSlots;
          }),
          catchError(error => {
            console.error('Error loading standard slots:', error);
            throw error;
          })
        );
      }

  createReservation(input: CreateReservationInput): Observable<any> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.apollo.mutate({
      mutation: CREATE_RESERVATION,
      variables: { input },
      errorPolicy: 'all'
    }).pipe(
          map(result => {
            if (result.errors) {
              throw new Error(result.errors[0]?.message || 'Failed to create reservation');
            }
        this._isLoading.set(false);
        this.toastService.showSuccess('Rezerwacja została utworzona pomyślnie!');
        this.loadMyReservations();
        return result.data;
      }),
      catchError(error => {
        this._isLoading.set(false);

        // Uproszczenie: wszystkie błędy obsługiwane przez ErrorService
        this.errorService.handleError(error);

        const errorMessage = this.extractErrorMessage(error);
        this._error.set(errorMessage);
        throw error;
      })
    );
  }

  clearError(): void {
    this._error.set(null);
  }

  private extractErrorMessage(error: any): string {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const graphQLError = error.graphQLErrors[0];
      return graphQLError.message;
    }

    if (error.errors && error.errors.length > 0) {
      const apolloError = error.errors[0];
      return apolloError.message;
    }

    if (error.networkError) {
      if (error.networkError.error && error.networkError.error.errors) {
        return error.networkError.error.errors[0].message;
      }
      if (error.networkError.message) {
        return error.networkError.message;
      }
    }

    if (error.message) {
      return error.message;
    }

    if (error.extensions && error.extensions.exception) {
      return error.extensions.exception.message || error.extensions.exception.className;
    }

    return 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
  }

  private extractErrorCode(error: any): string | undefined {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].extensions?.code;
    }

    if (error.errors && error.errors.length > 0) {
      return error.errors[0].extensions?.code;
    }

    if (error.networkError?.error?.errors?.[0]?.extensions?.code) {
      return error.networkError.error.errors[0].extensions.code;
    }

    if (error.extensions?.code) {
      return error.extensions.code;
    }

    return undefined;
  }

  loadUserDetails(): void {
    this.getMyDetails().subscribe();
  }

  loadBuildings(): void {
    this.getBuildings().subscribe();
  }

  loadMyReservations(): void {
    this.getMyReservations().subscribe();
  }

  getMyReservations(): Observable<ReservationPayload[]> {
    return this.createQueryObservable(() =>
      this.apollo.watchQuery<{ myReservations: ReservationPayload[] }>({
        query: GET_MY_RESERVATIONS,
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      }).valueChanges.pipe(
        map(result => {
          if (result.errors) {
            throw new Error(result.errors[0]?.message || 'Failed to load reservations');
          }
          const reservations = result.data.myReservations;
          this._myReservations.set(reservations);
          return reservations;
        })
      )
    );
  }

  cancelReservation(reservationId: string): Observable<boolean> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.apollo.mutate<{ cancelReservation: boolean }>({
      mutation: CANCEL_RESERVATION,
      variables: { reservationId },
      errorPolicy: 'none'
    }).pipe(
      map(result => {
        this._isLoading.set(false);
        this.toastService.showSuccess('Rezerwacja została anulowana pomyślnie!');
        this.loadMyReservations(); 
        return result.data!.cancelReservation;
      }),
      catchError(error => {
        this._isLoading.set(false);
        this.errorService.handleError(error);
        const errorMessage = this.extractErrorMessage(error);
        this._error.set(errorMessage);
        throw error;
      })
    );
  }
}
