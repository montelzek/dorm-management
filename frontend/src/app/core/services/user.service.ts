import { inject, Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { User } from '../../shared/models/graphql.types';
import { gql } from 'apollo-angular';

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      firstName
      lastName
      email
      phone
      role
      building {
        id
        name
      }
      room {
        id
        roomNumber
      }
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apollo = inject(Apollo);

  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  readonly currentUser = computed(() => this._currentUser());
  readonly isLoading = computed(() => this._isLoading());
  readonly error = computed(() => this._error());

  getCurrentUser(): Observable<User> {
    this._isLoading.set(true);
    this._error.set(null);

    return this.apollo.watchQuery<{ me: User }>({
      query: GET_CURRENT_USER,
      errorPolicy: 'all',
      fetchPolicy: 'network-only'
    }).valueChanges.pipe(
      map(result => {
        if (result.errors) {
          throw new Error(result.errors[0]?.message || 'Failed to load user details');
        }
        const user = result.data.me;
        this._currentUser.set(user);
        this._isLoading.set(false);
        return user;
      }),
      catchError(error => {
        this._isLoading.set(false);
        const errorMessage = this.extractErrorMessage(error);
        this._error.set(errorMessage);
        throw error;
      }),
      shareReplay(1)
    );
  }

  loadCurrentUser(): void {
    this.getCurrentUser().subscribe();
  }

  clearUser(): void {
    this._currentUser.set(null);
  }

  private extractErrorMessage(error: any): string {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }

    if (error.errors && error.errors.length > 0) {
      return error.errors[0].message;
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

    return 'An unexpected error occurred. Please try again.';
  }
}

