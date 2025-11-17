import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicianTask } from '../../technician.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-task-detail-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './task-detail-modal.component.html'
})
export class TaskDetailModalComponent {
  readonly task = input.required<TechnicianTask>();

  readonly cancel = output<void>();

  onCancel(): void {
    this.cancel.emit();
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'REPORTED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  getPriorityClasses(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'URGENT':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
}
