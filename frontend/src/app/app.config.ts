import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {Apollo, APOLLO_OPTIONS} from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { createHttpLink } from '@apollo/client/link/http';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CalendarDateFormatter, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

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
    cache: new InMemoryCache({
      typePolicies: {
        AnnouncementPayload: {
          fields: {
            buildings: {
              merge(existing, incoming) {
                return incoming;
              }
            }
          }
        }
      }
    }),
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor, ErrorInterceptor])),
    provideAnimations(),
    Apollo,
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    },
    {
      provide: DateAdapter,
      useFactory: adapterFactory
    }
  ],
};
