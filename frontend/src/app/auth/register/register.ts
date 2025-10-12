import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Auth} from '../auth';
import {Router, RouterLink} from '@angular/router';
import {RegisterInput} from '../../graphql.types';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private router = inject(Router);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  errorMessage: string | null = null;

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
}
