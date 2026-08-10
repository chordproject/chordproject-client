import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      // Redirect empty path to '/admin/example'
      { path: '', pathMatch: 'full', redirectTo: 'example' },

      // -----------------------------------------------------------------------
      // Example
      // -----------------------------------------------------------------------
      {
        path: 'example',
        loadChildren: () => import('./modules/example/routes'),
      },

      // -----------------------------------------------------------------------
      // Extras
      // -----------------------------------------------------------------------
      {
        path: 'error',
        loadChildren: () => import('./modules/extras/error/routes'),
      },

      // 404
      {
        path: '404',
        pathMatch: 'full',
        loadComponent: () =>
          import('./modules/extras/error/features/error-404'),
      },

      // Catch all
      { path: '**', redirectTo: '404' },
    ],
  },
];

export default routes;
