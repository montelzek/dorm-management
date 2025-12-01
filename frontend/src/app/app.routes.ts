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
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'technician/dashboard',
    loadComponent: () => import('./features/technician/dashboard/dashboard').then(m => m.TechnicianDashboardComponent),
    canActivate: [authGuard]
  },

  {
    path: 'technician/new-tasks',
    loadComponent: () => import('./features/technician/new-tasks/new-tasks').then(m => m.NewTasksComponent),
    canActivate: [authGuard]
  },

  {
    path: 'technician/tasks-history',
    loadComponent: () => import('./features/technician/tasks-history/tasks-history').then(m => m.TasksHistoryComponent),
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

  {
    path: 'admin/issues',
    loadComponent: () => import('./features/admin/issues-management/issues-management').then(m => m.IssuesManagementComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/facilities',
    loadComponent: () => import('./features/admin/facilities-management/facilities-management').then(m => m.FacilitiesManagementComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/events',
    loadComponent: () => import('./features/admin/events-management/events-management').then(m => m.EventsManagementComponent),
    canActivate: [authGuard]
  },

  {
    path: 'events',
    loadComponent: () => import('./features/resident/events/events').then(m => m.ResidentEventsComponent),
    canActivate: [authGuard]
  },

  {
    path: 'admin/announcements',
    loadComponent: () => import('./features/admin/announcements-management/announcements-management').then(m => m.AnnouncementsManagementComponent),
    canActivate: [authGuard]
  },

  {
    path: 'announcements',
    loadComponent: () => import('./features/resident/announcements/announcements').then(m => m.ResidentAnnouncementsComponent),
    canActivate: [authGuard]
  },


  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
