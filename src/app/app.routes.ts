import { Route } from '@angular/router';

export const routes: Route[] = [
  // Website routes
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./domains/website/routes'),
  },

  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Admin
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/routes'),
  },

  // Coming soon
  {
    path: 'coming-soon',
    loadChildren: () => import('./domains/coming-soon/routes'),
  },

  {
    path: 'documentation',
    loadChildren: () => import('@/app/domains/documentation/routes'),
  },
];
