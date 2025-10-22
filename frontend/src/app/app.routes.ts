import { Routes } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register';
import { LoginComponent } from './features/auth/login/login';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'dashboard',
    loadComponent: () => import('./features/resident/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'reservation',
    loadComponent: () => import('./features/resident/reservations/reservations').then(m => m.ReservationsComponent),
    canActivate: [authGuard]
  },

  {
    path: 'issues',
    loadComponent: () => import('./features/resident/issues/issues').then(m => m.IssuesComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/residents',
    loadComponent: () => import('./features/admin/residents-management/residents-management').then(m => m.ResidentsManagementComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/reservations',
    loadComponent: () => import('./features/admin/reservations-management/reservations-management').then(m => m.ReservationsManagementComponent),
    canActivate: [authGuard]
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
