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

    console.error('Error occurred:', error);

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
      timestamp: new Date(),
      severity: this.determineSeverity(error)
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

  private determineSeverity(error: any): ErrorSeverity {
    return 'warning';
  }

}
