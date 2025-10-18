import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {Auth} from '../auth';
import {LoginInput} from '../../graphql.types';
import {NgOptimizedImage} from '@angular/common';
import {ThemeToggle} from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NgOptimizedImage,
    ThemeToggle
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  errorMessage: string | null = null;
  checked = false;
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;

    this.authService.login(this.loginForm.value as LoginInput)
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = err.message;
        }
      });
  }

  ngOnInit(): void {
    this.checked = document.documentElement.classList.contains('my-app-dark');
  }
}
