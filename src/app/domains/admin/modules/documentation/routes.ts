import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout'),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'getting-started/introduction',
      },
      {
        path: 'getting-started',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'introduction',
          },
          {
            path: 'installation',
            loadComponent: () =>
              import('./features/getting-started/installation'),
          },
          {
            path: 'development',
            loadComponent: () =>
              import('./features/getting-started/development'),
          },
          {
            path: 'building',
            loadComponent: () => import('./features/getting-started/building'),
          },
        ],
      },
      {
        path: 'changelog',
        loadComponent: () => import('./features/changelog/changelog'),
      },
    ],
  },
];

export default routes;
