import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';

import {Auth} from '../auth';
import {LoginInput} from '../../graphql.types';
import {FloatLabel} from 'primeng/floatlabel';
import {InputText} from 'primeng/inputtext';
import {Message} from 'primeng/message';
import {Password} from 'primeng/password';
import {Button, ButtonDirective} from 'primeng/button';
import {Card} from 'primeng/card';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FloatLabel,
    InputText,
    Message,
    Password,
    ButtonDirective,
    Button,
    Card,
    ToggleSwitch,
    FormsModule,
    NgClass],
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

  toggleDarkMode(): void {
    const html = document.documentElement;
    if (this.checked) {
      html.classList.add('my-app-dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      html.classList.remove('my-app-dark');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
