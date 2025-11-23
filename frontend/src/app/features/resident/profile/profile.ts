import { Component, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { MainLayoutComponent } from '../../../shared/components/layout/main-layout/main-layout';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { UPDATE_MY_PROFILE } from './profile.graphql';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainLayoutComponent,
    TranslateModule
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly apollo = inject(Apollo);
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  readonly currentUser = this.userService.currentUser;
  
  profileForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor() {
    // Populate form when user data is loaded
    effect(() => {
      const user = this.currentUser();
      if (user && this.profileForm) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || '',
          phone: user.phone || ''
        });
      }
    });
  }

  ngOnInit(): void {
    this.userService.loadCurrentUser();
    
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.maxLength(20)]]
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const input = {
      firstName: this.profileForm.value.firstName,
      lastName: this.profileForm.value.lastName,
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone || null
    };

    this.apollo.mutate({
      mutation: UPDATE_MY_PROFILE,
      variables: { input }
    }).subscribe({
      next: (result: any) => {
        this.isSubmitting = false;
        this.toastService.showSuccess('toast.success.profileUpdated');
        
        // Reload user data to reflect changes in header
        this.userService.loadCurrentUser();
        
        // Stay on profile page - do not navigate
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = this.extractErrorMessage(error);
        this.toastService.showError('toast.error.updatingProfile');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  private extractErrorMessage(error: any): string {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
    if (error.networkError) {
      return 'Network error. Please try again.';
    }
    return 'An unexpected error occurred. Please try again.';
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get email() {
    return this.profileForm.get('email');
  }

  get phone() {
    return this.profileForm.get('phone');
  }
}
