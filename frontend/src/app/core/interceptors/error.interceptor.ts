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
    return 'No connection to server. Check your internet connection.';
  }

  switch (error.status) {
    case 401:
      return 'Session expired. Please log in again.';
    case 403:
      return 'You do not have permission to perform this operation.';
    case 404:
      return 'Requested resource not found.';
    case 500:
      return 'Server error occurred. Please try again.';
    default:
      return error.error?.message || error.message || 'An unexpected error occurred.';
  }
}

