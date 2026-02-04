import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/file-manager'),
  },
  {
    path: 'folders/:folderId',
    loadComponent: () => import('./features/file-manager'),
  },
];

export default routes;
