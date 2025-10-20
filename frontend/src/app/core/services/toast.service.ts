import { Injectable, signal } from '@angular/core';
import { Toast } from '../../shared/models/error.models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  showSuccess(message: string, duration = 3000): void {
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'success',
      duration
    });
  }

  showError(message: string, duration = 5000): void {
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'error',
      duration
    });
  }

  showWarning(message: string, duration = 4000): void {
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'warning',
      duration
    });
  }

  private addToast(toast: Toast): void {
    this._toasts.update(toasts => [...toasts, toast]);
    setTimeout(() => this.removeToast(toast.id), toast.duration);
  }

  removeToast(id: string): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
