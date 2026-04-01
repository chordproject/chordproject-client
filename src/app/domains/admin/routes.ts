import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      // Redirect empty path to '/auth/sign-in'
      { path: '', pathMatch: 'full', redirectTo: '/auth/sign-in' },

      // -----------------------------------------------------------------------
      // Dashboards
      // -----------------------------------------------------------------------
      {
        path: 'dashboards',
        loadChildren: () => import('./modules/dashboards/routes'),
      },

      // -----------------------------------------------------------------------
      // General
      // -----------------------------------------------------------------------
      {
        path: 'academy',
        loadChildren: () => import('./modules/apps/academy/routes'),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./modules/apps/contacts/routes'),
      },
      {
        path: 'file-manager',
        loadChildren: () => import('./modules/apps/file-manager/routes'),
      },
      {
        path: 'help-center',
        loadChildren: () => import('./modules/apps/help-center/routes'),
      },
      {
        path: 'notes',
        loadChildren: () => import('./modules/apps/notes/routes'),
      },
      {
        path: 'tasks',
        loadChildren: () => import('./modules/apps/tasks/routes'),
      },

      // -----------------------------------------------------------------------
      // Extras
      // -----------------------------------------------------------------------
      {
        path: 'settings',
        loadChildren: () => import('./modules/extras/settings/routes'),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./modules/extras/notifications/routes'),
      },
      {
        path: 'error',
        loadChildren: () => import('./modules/extras/error/routes'),
      },

      // -----------------------------------------------------------------------
      // Documentation
      // -----------------------------------------------------------------------
      {
        path: 'documentation',
        loadChildren: () => import('./modules/documentation/routes'),
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
