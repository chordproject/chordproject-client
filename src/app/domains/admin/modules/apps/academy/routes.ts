import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/courses'),
  },
  {
    path: ':id',
    loadComponent: () => import('./features/course'),
  },
];

export default routes;
