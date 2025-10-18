import { Routes } from '@angular/router';
import { Register } from './auth/register/register';
import { Login } from './auth/login/login';
import { authGuard } from './auth/auth-guard';

export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },

  {
    path: 'dashboard',
    loadComponent: () => import('./features/resident/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },

  {
    path: 'reservation',
    loadComponent: () => import('./features/resident/reservations/reservations').then(m => m.Reservations),
    canActivate: [authGuard]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
