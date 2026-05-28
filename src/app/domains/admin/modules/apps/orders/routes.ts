import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/orders'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/order'),
      },
    ],
  },
];

export default routes;
