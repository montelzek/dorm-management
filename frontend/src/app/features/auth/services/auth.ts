import { Injectable, inject, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, catchError } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginInput, RegisterInput } from '../../../shared/models/graphql.types';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../auth.graphql';
import { ToastService } from '../../../core/services/toast.service';

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
          this.toastService.showError('An error occurred during registration');
        }
        throw error;
      })
    );
  }

  login(input: LoginInput): Observable<LoginResponse> {
    return this.apollo.mutate<{ loginUser: LoginResponse }>({
      mutation: LOGIN_MUTATION,
      variables: { loginInput: input },
      errorPolicy: 'none'
    }).pipe(
      map(response => {
        const userData = response.data!.loginUser;
        if (userData?.token) {
          this.setAuthToken(userData.token);
          this._currentUser.set(userData);
          this._isLoggedIn.set(true);
          this.apollo.client.resetStore();
        }
        return userData;
      }),
      catchError(error => {
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          const errorMessage = error.graphQLErrors[0].message;
          this.toastService.showError(errorMessage);
        } else {
          this.toastService.showError('An error occurred during login');
        }
        throw error;
      })
    );
  }

  logout(): void {
    this.clearAuthToken();
    this._currentUser.set(null);
    this._isLoggedIn.set(false);
    this.apollo.client.resetStore();
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
