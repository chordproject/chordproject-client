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
            path: 'introduction',
            loadComponent: () =>
              import('./modules/getting-started/introduction'),
          },
          {
            path: 'prerequisites',
            loadComponent: () =>
              import('./modules/getting-started/prerequisites'),
          },
          {
            path: 'installation',
            loadComponent: () =>
              import('./modules/getting-started/installation'),
          },
          {
            path: 'serving',
            loadComponent: () => import('./modules/getting-started/serving'),
          },
        ],
      },
      {
        path: 'changelog',
        loadComponent: () => import('./modules/changelog/changelog'),
      },
    ],
  },
];

export default routes;
