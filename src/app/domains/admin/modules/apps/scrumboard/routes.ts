import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/scrumboard'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/card'),
      },
    ],
  },
];

export default routes;
