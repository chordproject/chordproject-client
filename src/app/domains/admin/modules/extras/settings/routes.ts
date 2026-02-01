import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'account',
      },
      {
        path: 'account',
        loadComponent: () => import('./features/account'),
      },
      {
        path: 'security',
        loadComponent: () => import('./features/security'),
      },
      {
        path: 'plan-and-billing',
        loadComponent: () => import('./features/plan-and-billing'),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications'),
      },
      {
        path: 'team',
        loadComponent: () => import('./features/team'),
      },
    ],
  },
];

export default routes;
