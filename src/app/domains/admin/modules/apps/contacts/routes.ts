import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/contacts'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/contact'),
      },
    ],
  },
];

export default routes;
