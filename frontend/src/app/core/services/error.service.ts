import { Injectable, signal } from '@angular/core';
import { AppError, ErrorSeverity } from '../../shared/models/error.models';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _errors = signal<AppError[]>([]);
  private _currentError = signal<AppError | null>(null);

  errors = this._errors.asReadonly();
  currentError = this._currentError.asReadonly();

  handleError(error: any): void {
    const appError = this.createAppError(error);

    this._errors.update(errors => [...errors, appError]);

    this._currentError.set(appError);

    if (!this.isProduction()) {
      console.error('Error occurred:', error);
    }

    setTimeout(() => this.clearError(appError.id), 5000);
  }

  clearError(errorId: string): void {
    this._errors.update(errors => errors.filter(e => e.id !== errorId));

    if (this._currentError()?.id === errorId) {
      this._currentError.set(null);
    }
  }
  private createAppError(error: any): AppError {
    return {
      id: crypto.randomUUID(),
      message: this.extractMessage(error),
      code: this.extractCode(error),
      timestamp: new Date(),
      severity: this.determineSeverity(error),
      field: this.extractField(error)
    };
  }

  private extractMessage(error: any): string {
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
      if (error.networkError.error && error.networkError.error.data && error.networkError.error.data.errors) {
        return error.networkError.error.data.errors[0].message;
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

    if (error.error && error.error.data && error.error.data.errors) {
      return error.error.data.errors[0].message;
    }

    return 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.';
  }

  private extractCode(error: any): string | undefined {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].extensions?.code;
    }

    if (error.errors && error.errors.length > 0) {
      return error.errors[0].extensions?.code;
    }

    if (error.networkError) {
      if (error.networkError.error && error.networkError.error.data && error.networkError.error.data.errors) {
        return error.networkError.error.data.errors[0].extensions?.code;
      }
    }

    if (error.error && error.error.data && error.error.data.errors) {
      return error.error.data.errors[0].extensions?.code;
    }

    if (error.extensions?.code) {
      return error.extensions.code;
    }

    return undefined;
  }

  private extractField(error: any): string | undefined {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].extensions?.field;
    }

    if (error.errors && error.errors.length > 0) {
      return error.errors[0].extensions?.field;
    }

    if (error.networkError) {
      if (error.networkError.error && error.networkError.error.data && error.networkError.error.data.errors) {
        return error.networkError.error.data.errors[0].extensions?.field;
      }
    }

    if (error.error && error.error.data && error.error.data.errors) {
      return error.error.data.errors[0].extensions?.field;
    }

    if (error.extensions?.field) {
      return error.extensions.field;
    }

    return undefined;
  }

  private determineSeverity(error: any): ErrorSeverity {
    const code = this.extractCode(error);

    if (code === 'RESOURCE_CONFLICT' || code === 'INVALID_TIME' || code === 'VALIDATION_ERROR' ||
        code === 'INVALID_DATE' || code === 'RESERVATION_TOO_LONG' || code === 'OUTSIDE_HOURS' ||
        code === 'REQUIRED_FIELD' || code === 'INVALID_FORMAT') {
      return 'warning';
    }

    if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN' || code === 'INVALID_CREDENTIALS') {
      return 'error';
    }

    if (code === 'RESOURCE_NOT_FOUND' || code === 'USER_NOT_FOUND' || code === 'BUILDING_NOT_FOUND') {
      return 'warning';
    }

    if (code === 'INTERNAL_ERROR' || code === 'DATABASE_ERROR' || code === 'NETWORK_ERROR') {
      return 'error';
    }

    return 'error';
  }

  private isProduction(): boolean {
    return false;
  }
}
