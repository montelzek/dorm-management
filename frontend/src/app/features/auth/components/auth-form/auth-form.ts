import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface AuthFormData {
  [key: string]: any;
}

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css'
})
export class AuthFormComponent {
  readonly form = input.required<FormGroup>();
  readonly title = input<string>('');
  readonly submitText = input<string>('Submit');
  readonly isLoading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);
  readonly showForgotPassword = input<boolean>(false);
  readonly linkText = input<string>('');
  readonly linkRoute = input<string>('');
  readonly linkLabel = input<string>('');

  readonly formSubmit = output<AuthFormData>();
  readonly forgotPasswordClick = output<void>();


  onSubmit(): void {
    if (this.form().valid) {
      this.formSubmit.emit(this.form().value);
    }
  }

  onForgotPassword(): void {
    this.forgotPasswordClick.emit();
  }
}
