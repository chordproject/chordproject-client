import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'project',
  },
  {
    path: 'project',
    loadComponent: () => import('./features/project/project'),
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics'),
  },
  {
    path: 'finance',
    loadComponent: () => import('./features/finance/finance'),
  },
];

export default routes;
