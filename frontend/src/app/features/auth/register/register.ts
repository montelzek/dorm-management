import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { AuthService } from '../services/auth';
import { RegisterInput } from '../../../shared/models/graphql.types';
import { ThemeToggleComponent } from '../../../shared/components/ui/theme-toggle/theme-toggle';
import { LanguageSelectorComponent } from '../../../shared/components/ui/language-selector/language-selector';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgOptimizedImage,
    TranslateModule,
    ThemeToggleComponent,
    LanguageSelectorComponent
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly isLoading = signal<boolean>(false);
  readonly isDarkMode = signal<boolean>(false);

  readonly registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    this.isDarkMode.set(document.documentElement.classList.contains('my-app-dark'));
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.performRegistration();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  private performRegistration(): void {
    this.setLoading(true);

    const registerData = this.registerForm.value as RegisterInput;

    this.authService.register(registerData).subscribe({
      next: () => this.handleRegistrationSuccess(),
      error: (error) => this.handleRegistrationError(error)
    });
  }

  private handleRegistrationSuccess(): void {
    this.setLoading(false);
    this.toastService.showSuccess('toast.success.accountCreated');
    this.router.navigate(['/login']);
  }

  private handleRegistrationError(error: any): void {
    this.setLoading(false);
  }

  private setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }
}
