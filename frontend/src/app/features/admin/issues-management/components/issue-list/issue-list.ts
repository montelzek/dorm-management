import { Component, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminIssue } from '../../services/admin-issue.service';
import { ButtonComponent } from '../../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-admin-issue-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DatePipe],
  templateUrl: './issue-list.html'
})
export class IssueListComponent {
  readonly issues = input.required<AdminIssue[]>();
  readonly isLoading = input<boolean>(false);

  readonly changeStatus = output<AdminIssue>();

  onChangeStatus(issue: AdminIssue): void {
    this.changeStatus.emit(issue);
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
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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

