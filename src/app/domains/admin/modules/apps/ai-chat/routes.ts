import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/ai-chat'),
    children: [
      {
        path: ':id',
        loadComponent: () => import('./features/conversation'),
      },
    ],
  },
];

export default routes;
