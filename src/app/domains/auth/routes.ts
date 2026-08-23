import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in',
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/forgot-password/forgot-password'),
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/reset-password/reset-password'),
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./features/sign-in/sign-in'),
      },
      {
        path: 'sign-up',
        loadComponent: () => import('./features/sign-up/sign-up'),
      },
    ],
  },
];

export default routes;
