import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Issue } from '../../services/issue.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-issue-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslateModule],
  templateUrl: './issue-list.html'
})
export class IssueListComponent {
  readonly issues = input.required<Issue[]>();
  readonly isLoading = input<boolean>(false);
  readonly statusFilter = input<string>('');

  readonly cancelIssue = output<string>();
  readonly filterChange = output<string>();

  onCancelIssue(issueId: string): void {
    if (confirm('Are you sure you want to cancel this issue?')) {
      this.cancelIssue.emit(issueId);
    }
  }

  onFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.filterChange.emit(value);
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status) {
      case 'REPORTED':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'IN_PROGRESS':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'RESOLVED':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'CANCELLED':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  getPriorityClass(priority: string): string {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (priority) {
      case 'LOW':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
      case 'MEDIUM':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'HIGH':
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300`;
      case 'URGENT':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  getStatusKey(status: string): string {
    return `issues.status.${status}`;
  }

  getPriorityKey(priority: string): string {
    return `issues.priority.${priority}`;
  }
}


