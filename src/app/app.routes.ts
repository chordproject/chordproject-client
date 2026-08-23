import { Route } from '@angular/router';

export const routes: Route[] = [
  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Main application
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: '',
    loadChildren: () => import('./domains/admin/routes'),
  },
];
