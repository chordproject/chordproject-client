import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/home'),
  },
  {
    path: 'faq',
    loadComponent: () => import('./features/faq'),
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support'),
  },
  {
    path: 'guides',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'getting-started',
      },
      {
        path: ':id',
        loadComponent: () => import('./features/guide'),
      },
    ],
  },
];

export default routes;
