import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginInput, RegisterInput } from '../graphql.types';

const LOGIN_MUTATION = gql`
  mutation LoginUser($loginInput: LoginInput!) {
    loginUser(loginInput: $loginInput) {
      token
      id
      email
      firstName
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation RegisterUser($registerInput: RegisterInput!) {
    registerUser(registerInput: $registerInput) {
      message
    }
  }
`;

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apollo = inject(Apollo);

  private _isLoggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$: Observable<boolean> = this._isLoggedIn.asObservable();

  register(input: RegisterInput) {
    return this.apollo.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        registerInput: input
      }
    });
  }

  login(input: LoginInput): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        loginInput: input
      }
    }).pipe(
      tap((response: any) => {
        if (response.data?.loginUser?.token) {
          localStorage.setItem('auth_token', response.data.loginUser.token);
          this._isLoggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this._isLoggedIn.next(false);
    this.apollo.client.resetStore();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
