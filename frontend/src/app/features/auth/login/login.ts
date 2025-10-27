import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

import { AuthService } from '../services/auth';
import { LoginInput } from '../../../shared/models/graphql.types';
import { ThemeToggleComponent } from '../../../shared/components/ui/theme-toggle/theme-toggle';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgOptimizedImage,
    ThemeToggleComponent
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly isLoading = signal<boolean>(false);
  readonly isDarkMode = signal<boolean>(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    this.isDarkMode.set(document.documentElement.classList.contains('my-app-dark'));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.performLogin();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private performLogin(): void {
    this.setLoading(true);

    const loginData = this.loginForm.value as LoginInput;

    this.authService.login(loginData).subscribe({
      next: (userData) => this.handleLoginSuccess(userData),
      error: (error) => this.handleLoginError(error)
    });
  }

  private handleLoginSuccess(userData: any): void {
    this.setLoading(false);
    
    // Redirect based on user role
    const userRole = userData?.role;
    if (userRole === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  private handleLoginError(error: any): void {
    this.setLoading(false);
  }

  private setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }
}
