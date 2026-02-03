import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      // Redirect empty path to 'dashboards'
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboards',
      },

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
        path: 'chat',
        loadChildren: () => import('./modules/apps/chat/chat.routes'),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./modules/apps/contacts/contacts.routes'),
      },
      {
        path: 'ecommerce',
        loadChildren: () => import('./modules/apps/ecommerce/ecommerce.routes'),
      },
      {
        path: 'file-manager',
        loadChildren: () =>
          import('./modules/apps/file-manager/file-manager.routes'),
      },
      {
        path: 'help-center',
        loadChildren: () => import('./modules/apps/help-center/routes'),
      },
      {
        path: 'mailbox',
        loadChildren: () => import('./modules/apps/mailbox/mailbox.routes'),
      },
      {
        path: 'notes',
        loadChildren: () => import('./modules/apps/notes/notes.routes'),
      },
      {
        path: 'scrumboard',
        loadChildren: () =>
          import('./modules/apps/scrumboard/scrumboard.routes'),
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

      // {
      //   path: 'notifications',
      //   loadChildren: () => import('./modules/pages/notifications/routes'),
      // },

      {
        path: 'error',
        loadChildren: () => import('./modules/extras/error/routes'),
      },

      {
        path: 'pages',
        children: [
          // Error page
          {
            path: 'error',
            loadChildren: () => import('./modules/extras/error/routes'),
          },

          // Activities
          {
            path: 'activities',
            loadChildren: () =>
              import('./modules/extras/activities/activities.routes'),
          },

          // Authentication
          /*{
            path: 'authentication',
            loadChildren: () =>
              import('./modules/pages/authentication/authentication.routes'),
          },*/

          /*{
            path: 'error',
            children: [
              {
                path: '404',
                loadChildren: () =>
                  import('./modules/pages/error/error-404/error-404.routes'),
              },
              {
                path: '500',
                loadChildren: () =>
                  import('./modules/pages/error/error-500/error-500.routes'),
              },
            ],
          },*/

          // Invoice
          {
            path: 'invoice',
            children: [
              {
                path: 'printable',
                children: [
                  {
                    path: 'compact',
                    loadChildren: () =>
                      import('./modules/extras/invoice/printable/compact/compact.routes'),
                  },
                  {
                    path: 'modern',
                    loadChildren: () =>
                      import('./modules/extras/invoice/printable/modern/modern.routes'),
                  },
                ],
              },
            ],
          },

          // Maintenance
          {
            path: 'maintenance',
            loadChildren: () =>
              import('./modules/extras/maintenance/maintenance.routes'),
          },

          // Pricing
          {
            path: 'pricing',
            children: [
              {
                path: 'modern',
                loadChildren: () =>
                  import('./modules/extras/pricing/modern/modern.routes'),
              },
              {
                path: 'simple',
                loadChildren: () =>
                  import('./modules/extras/pricing/simple/simple.routes'),
              },
              {
                path: 'single',
                loadChildren: () =>
                  import('./modules/extras/pricing/single/single.routes'),
              },
              {
                path: 'table',
                loadChildren: () =>
                  import('./modules/extras/pricing/table/table.routes'),
              },
            ],
          },

          // Profile
          {
            path: 'profile',
            loadChildren: () =>
              import('./modules/extras/profile/profile.routes'),
          },
        ],
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
