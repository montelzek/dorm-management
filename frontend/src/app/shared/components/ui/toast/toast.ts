import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md sm:top-2 sm:right-2 sm:left-2 sm:max-w-sm">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out"
          [ngClass]="getToastClasses(toast.type)">
          <div class="flex-shrink-0 mr-3">
            @switch (toast.type) {
              @case ('success') {
                <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
              }
              @case ('error') {
                <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
              }
              @case ('warning') {
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
              }
              @case ('info') {
                <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                </svg>
              }
            }
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium" [ngClass]="getTextClasses(toast.type)">
              {{ toast.message }}
            </p>
          </div>
          <button 
            (click)="toastService.removeToast(toast.id)"
            class="ml-3 flex-shrink-0 opacity-50 hover:opacity-75 transition-opacity"
            [ngClass]="getButtonClasses(toast.type)">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
  
  getToastClasses(type: string): string {
    const baseClasses = 'bg-opacity-95 backdrop-blur-sm';
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800`;
    }
  }
  
  getTextClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-gray-800 dark:text-gray-200';
    }
  }
  
  getButtonClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'text-green-400 hover:text-green-600';
      case 'error':
        return 'text-red-400 hover:text-red-600';
      case 'warning':
        return 'text-yellow-400 hover:text-yellow-600';
      case 'info':
        return 'text-blue-400 hover:text-blue-600';
      default:
        return 'text-gray-400 hover:text-gray-600';
    }
  }
}
