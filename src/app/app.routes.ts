import { Route } from '@angular/router';

export const routes: Route[] = [
  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Admin
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/home',
  },
  {
    path: 'home',
    redirectTo: 'admin/home',
  },
  {
    path: 'library',
    redirectTo: 'admin/library',
  },
  {
    path: 'songs',
    redirectTo: 'admin/songs',
  },
  {
    path: 'songbook',
    redirectTo: 'admin/songbook',
  },
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/routes'),
  },
];
