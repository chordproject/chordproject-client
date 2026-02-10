import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/notes'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/note'),
      },
    ],
  },
];

export default routes;
