import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {Apollo, APOLLO_OPTIONS} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/link/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { routes } from './app.routes';

const uri = 'http://localhost:8080/graphql';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const auth = setContext((_operation, _context) => {
    const token = localStorage.getItem('auth_token');

    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }

    return {};
  });

  const http = createHttpLink({
    uri: uri
  });

  return {
    link: auth.concat(http),
    cache: new InMemoryCache(),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([ErrorInterceptor])),
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    },
  ],
};
