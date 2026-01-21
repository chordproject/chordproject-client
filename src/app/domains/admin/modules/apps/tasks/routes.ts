import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/tasks'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/task'),
      },
    ],
  },
];

export default routes;
