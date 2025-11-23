import { Injectable, inject, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { switchMap, tap } from 'rxjs/operators';
import { LoginInput, RegisterInput, User } from '../../../shared/models/graphql.types';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../auth.graphql';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../core/services/user.service';

export interface LoginResponse {
  token: string;
  id: string;
  email: string;
  firstName: string;
}

export interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apollo = inject(Apollo);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);

  private readonly _isLoggedIn = signal<boolean>(this.hasToken());
  private readonly _currentUser = signal<LoginResponse | null>(null);

  readonly isLoggedIn$ = new Observable<boolean>(subscriber => {
    subscriber.next(this._isLoggedIn());
  });

  register(input: RegisterInput): Observable<RegisterResponse> {
    return this.apollo.mutate<{ registerUser: RegisterResponse }>({
      mutation: REGISTER_MUTATION,
      variables: { registerInput: input },
      errorPolicy: 'none'
    }).pipe(
      map(response => response.data!.registerUser),
      catchError(error => {
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          const errorMessage = error.graphQLErrors[0].message;
          this.toastService.showError(errorMessage);
        } else {
          this.toastService.showError('toast.error.duringRegistration');
        }
        throw error;
      })
    );
  }

  login(input: LoginInput): Observable<User> {
    return this.apollo.mutate<{ loginUser: LoginResponse }>({
      mutation: LOGIN_MUTATION,
      variables: { loginInput: input },
      errorPolicy: 'none'
    }).pipe(
      map(response => response.data!.loginUser),
      tap(userData => {
        if (userData?.token) {
          this.setAuthToken(userData.token);
          this._isLoggedIn.set(true);
          // DO NOT set _currentUser here from login mutation payload — prefer
          // to load authoritative user details from the `me` query via
          // UserService.getCurrentUser(). That ensures signals stay consistent
          // with GraphQL server data and avoids partial payload mismatch.
        }
      }),
      // After token is set, immediately fetch current user from server and
      // propagate it via UserService. We return the User observable so callers
      // can react to the actual user (including role) and navigate safely.
      switchMap(() => {
        // getCurrentUser returns Observable<User>
        return this.userService.getCurrentUser();
      }),
      catchError(error => {
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          const errorMessage = error.graphQLErrors[0].message;
          this.toastService.showError(errorMessage);
        } else {
          this.toastService.showError('toast.error.duringLogin');
        }
        throw error;
      })
    );
  }

  logout(): void {
    this.clearAuthToken();
    this._currentUser.set(null);
    this._isLoggedIn.set(false);
    // Do not clear Apollo store here to avoid interfering with in-flight queries.
    // Services should use fetchPolicy: 'network-only' for user-specific data.
    // Clear the global user state as well
    try {
      this.userService.clearUser();
    } catch (e) {
      // ignore
    }
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
