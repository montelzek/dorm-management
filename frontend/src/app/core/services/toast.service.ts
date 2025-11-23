import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Toast } from '../../shared/models/error.models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly translateService = inject(TranslateService);
  private _toasts = signal<Toast[]>([]);
  toasts = this._toasts.asReadonly();

  showSuccess(messageKey: string, duration = 3000): void {
    const message = this.translateService.instant(messageKey);
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'success',
      duration
    });
  }

  showError(messageKey: string, duration = 5000): void {
    const message = this.translateService.instant(messageKey);
    this.addToast({
      id: crypto.randomUUID(),
      message,
      type: 'error',
      duration
    });
  }

  showWarning(messageKey: string, duration = 4000): void {
    const message = this.translateService.instant(messageKey);
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
