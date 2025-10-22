import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { ButtonComponent } from '../../../shared/components/ui/button/button';
import { ModalComponent } from '../../../shared/components/ui/modal/modal';
import { IssueListComponent } from './components/issue-list/issue-list';
import { IssueFormComponent } from './components/issue-form/issue-form';
import { IssueService } from './services/issue.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [
    MainLayoutComponent,
    ButtonComponent,
    ModalComponent,
    IssueListComponent,
    IssueFormComponent,
    ReactiveFormsModule
  ],
  templateUrl: './issues.html'
})
export class IssuesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly issueService = inject(IssueService);
  private readonly toastService = inject(ToastService);
  private readonly userService = inject(UserService);

  readonly isModalOpen = signal<boolean>(false);
  readonly statusFilter = signal<string>('');

  readonly currentUser = this.userService.currentUser;
  readonly myIssues = this.issueService.myIssues;
  readonly isLoading = this.issueService.isLoading;

  readonly issueForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    priority: ['', Validators.required]
  });

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    this.issueService.loadMyIssues();
  }

  openModal(): void {
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.resetForm();
  }

  onFormSubmit(): void {
    if (this.issueForm.valid) {
      const formValue = this.issueForm.value;
      this.issueService.createIssue({
        title: formValue.title!,
        description: formValue.description!,
        priority: formValue.priority!
      }).subscribe({
        next: () => {
          this.closeModal();
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  onCancelIssue(issueId: string): void {
    this.issueService.cancelIssue(issueId).subscribe({
      error: (error) => this.handleError(error)
    });
  }

  onFilterChange(status: string): void {
    this.statusFilter.set(status);
    this.issueService.loadMyIssues(status || undefined);
  }

  private resetForm(): void {
    this.issueForm.reset();
  }

  private handleError(error: any): void {
    console.error('Issue operation error:', error);
    
    let errorMessage = 'An error occurred. Please try again.';
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      errorMessage = error.graphQLErrors[0].message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    this.toastService.showError(errorMessage);
  }
}

