import { Component, inject, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { AdminIssueService, AdminIssue } from './services/admin-issue.service';
import { ToastService } from '../../../core/services/toast.service';
import { IssueListComponent } from './components/issue-list/issue-list';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { AssignTechnicianModalComponent } from './components/assign-technician-modal/assign-technician-modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-issues-management',
  standalone: true,
  imports: [
    MainLayoutComponent,
    IssueListComponent,
    ModalComponent,
    AssignTechnicianModalComponent,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './issues-management.html'
})
export class IssuesManagementComponent implements OnInit {
  private readonly issueService = inject(AdminIssueService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly Math = Math;
  readonly currentUser = this.userService.currentUser;
  readonly allIssues = this.issueService.allIssues;
  readonly buildings = this.issueService.buildings;
  readonly technicians = this.issueService.technicians;
  readonly totalElements = this.issueService.totalElements;
  readonly totalPages = this.issueService.totalPages;
  readonly currentPage = this.issueService.currentPage;
  readonly pageSize = this.issueService.pageSize;
  readonly isLoading = this.issueService.isLoading;

  readonly selectedStatusFilter = signal<string>('');
  readonly selectedPriorityFilter = signal<string>('');
  readonly selectedBuildingId = signal<string>('');
  readonly page = signal<number>(0);
  readonly size = signal<number>(10);

  readonly isAssignModalOpen = signal<boolean>(false);
  readonly selectedIssue = signal<AdminIssue | null>(null);

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.loadIssues();
    this.issueService.getBuildings();
    this.issueService.getTechnicians();
  }

  private loadIssues(): void {
    const status = this.selectedStatusFilter() || undefined;
    const priority = this.selectedPriorityFilter() || undefined;
    const buildingId = this.selectedBuildingId() || undefined;

    this.issueService.getAllIssues(
      this.page(),
      this.size(),
      status,
      priority,
      buildingId
    );
  }

  onStatusFilterChange(status: string): void {
    this.selectedStatusFilter.set(status);
    this.page.set(0);
    this.loadIssues();
  }

  onPriorityFilterChange(priority: string): void {
    this.selectedPriorityFilter.set(priority);
    this.page.set(0);
    this.loadIssues();
  }

  onBuildingFilterChange(buildingId: string): void {
    this.selectedBuildingId.set(buildingId);
    this.page.set(0);
    this.loadIssues();
  }

  onPageChange(newPage: number): void {
    this.page.set(newPage);
    this.loadIssues();
  }

  onPageSizeChange(newSize: number): void {
    this.size.set(newSize);
    this.page.set(0);
    this.loadIssues();
  }

  onCancelIssue(issue: AdminIssue): void {
    if (issue.status === 'CANCELLED' || issue.status === 'RESOLVED') {
      return;
    }

    if (confirm(`Are you sure you want to cancel the issue "${issue.title}"?`)) {
      this.issueService.cancelIssue(issue.id).subscribe({
        next: () => {
          this.loadIssues();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  onAssignTechnician(issue: AdminIssue): void {
    this.selectedIssue.set(issue);
    this.isAssignModalOpen.set(true);
  }

  onCloseAssignModal(): void {
    this.isAssignModalOpen.set(false);
    this.selectedIssue.set(null);
  }

  onAssignTechnicianSubmit(technicianId: string): void {
    const issue = this.selectedIssue();
    if (!issue) return;

    this.issueService.assignTechnician(issue.id, technicianId).subscribe({
      next: () => {
        this.onCloseAssignModal();
        this.loadIssues();
      },
      error: (error) => this.handleError(error)
    });
  }

  private handleError(error: any): void {
    console.error('Issue operation error:', error);
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = error.graphQLErrors[0].message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    this.toastService.showError(errorMessage);
  }
}

