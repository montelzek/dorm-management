import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../../../core/services/error.service';

@Component({
  selector: 'app-global-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (errorService.currentError(); as error) {
      <div class="fixed top-4 left-4 z-50 max-w-md">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg dark:bg-red-900/20 dark:border-red-800">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Błąd</h3>
              <p class="mt-1 text-sm text-red-700 dark:text-red-300">{{ error.message }}</p>
            </div>
            <button 
              (click)="errorService.clearError(error.id)"
              class="ml-3 text-red-400 hover:text-red-600 transition-colors">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class GlobalErrorComponent {
  errorService = inject(ErrorService);
}
