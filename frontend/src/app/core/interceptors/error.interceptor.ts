import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';
import { ToastService } from '../services/toast.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (req.url.includes('/graphql')) {
        return throwError(() => error);
      }

      if (error.error && (error.error.graphQLErrors || error.error.networkError)) {
        return throwError(() => error);
      }

      const errorMessage = extractErrorMessage(error);

      console.error('HTTP Error:', error);

      toastService.showError(errorMessage);
      errorService.handleError(error);

      return throwError(() => new Error(errorMessage));
    })
  );
};

function extractErrorMessage(error: HttpErrorResponse): string {
  if (error.error?.errors?.[0]?.message) {
    return error.error.errors[0].message;
  }

  if (error.error?.data?.errors?.[0]?.message) {
    return error.error.data.errors[0].message;
  }

  if (error.status === 0) {
    return 'Brak połączenia z serwerem. Sprawdź połączenie internetowe.';
  }

  switch (error.status) {
    case 401:
      return 'Sesja wygasła. Zaloguj się ponownie.';
    case 403:
      return 'Brak uprawnień do wykonania tej operacji.';
    case 404:
      return 'Nie znaleziono żądanego zasobu.';
    case 500:
      return 'Wystąpił błąd serwera. Spróbuj ponownie.';
    default:
      return error.error?.message || error.message || 'Wystąpił nieoczekiwany błąd.';
  }
}

