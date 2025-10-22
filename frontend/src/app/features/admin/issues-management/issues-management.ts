import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { AdminIssueService, AdminIssue } from './services/admin-issue.service';
import { ToastService } from '../../../core/services/toast.service';
import { IssueListComponent } from './components/issue-list/issue-list';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { StatusUpdateModalComponent } from './components/status-update-modal/status-update-modal';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-issues-management',
  standalone: true,
  imports: [
    MainLayoutComponent,
    IssueListComponent,
    ModalComponent,
    StatusUpdateModalComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './issues-management.html'
})
export class IssuesManagementComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly issueService = inject(AdminIssueService);
  private readonly userService = inject(UserService);
  private readonly toastService = inject(ToastService);

  readonly Math = Math;
  readonly currentUser = this.userService.currentUser;
  readonly allIssues = this.issueService.allIssues;
  readonly buildings = this.issueService.buildings;
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

  readonly isStatusModalOpen = signal<boolean>(false);
  readonly selectedIssue = signal<AdminIssue | null>(null);

  readonly statusForm = this.fb.group({
    status: ['', Validators.required]
  });

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.loadIssues();
    this.issueService.getBuildings();
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

  onChangeStatus(issue: AdminIssue): void {
    this.selectedIssue.set(issue);
    this.statusForm.patchValue({ status: issue.status });
    this.isStatusModalOpen.set(true);
  }

  onCloseStatusModal(): void {
    this.isStatusModalOpen.set(false);
    this.selectedIssue.set(null);
    this.statusForm.reset();
  }

  onStatusFormSubmit(): void {
    const issue = this.selectedIssue();
    if (!issue || this.statusForm.invalid) return;

    const newStatus = this.statusForm.get('status')?.value;
    if (!newStatus) return;

    this.issueService.updateStatus(issue.id, newStatus).subscribe({
      next: () => {
        this.onCloseStatusModal();
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

