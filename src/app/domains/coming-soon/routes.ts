import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout'),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/coming-soon'),
      },
    ],
  },
];

export default routes;
