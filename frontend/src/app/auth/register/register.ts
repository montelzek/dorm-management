import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../auth';
import {Router, RouterLink} from '@angular/router';
import {RegisterInput} from '../../graphql.types';
import {NgOptimizedImage} from '@angular/common';
import {ThemeToggle} from '../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FormsModule, NgOptimizedImage, ThemeToggle],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {

  errorMessage: string | null = null;
  checked = false;
  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.errorMessage = null;

    this.authService.register(this.registerForm.value as RegisterInput)
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => this.errorMessage = err.message
      });
  }

  ngOnInit(): void {
    this.checked = document.documentElement.classList.contains('my-app-dark');
  }
}
