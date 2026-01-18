import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  // Redirect empty path to '/auth/sign-in'
  { path: '', pathMatch: 'full', redirectTo: '/auth/sign-in' },

  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Admin
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/routes'),
  },

  // Coming soon
  {
    path: 'coming-soon',
    loadChildren: () => import('./domains/coming-soon/routes'),
  },

  // Landing routes
  /*{
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'home',
        loadChildren: () => import('@/app/domains/landing/home/home.routes'),
      },
    ],
  },*/

  // Documentation routes
  // {
  //     path: '',
  //     component: LayoutComponent,
  //     data: {
  //         layout: 'classic'
  //     },
  //     children: [
  //         {path: 'documentation', loadChildren: () => import('./features/documentation/documentation.routes')},
  //     ]
  // },
  {
    path: 'documentation',
    loadChildren: () =>
      import('@/app/domains/documentation/documentation.routes'),
  },

  // Admin routes
  /*{
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      // Dashboards
      {
        path: 'dashboards',
        children: [
          {
            path: 'project',
            loadChildren: () =>
              import('@/app/domains/admin/modules/dashboards/project/project.routes'),
          },
          {
            path: 'analytics',
            loadChildren: () =>
              import('@/app/domains/admin/modules/dashboards/analytics/analytics.routes'),
          },
          {
            path: 'finance',
            loadChildren: () =>
              import('@/app/domains/admin/modules/dashboards/finance/finance.routes'),
          },
          {
            path: 'crypto',
            loadChildren: () =>
              import('@/app/domains/admin/modules/dashboards/crypto/crypto.routes'),
          },
        ],
      },

      // Apps
      {
        path: 'apps',
        children: [
          {
            path: 'academy',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/academy/academy.routes'),
          },
          {
            path: 'chat',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/chat/chat.routes'),
          },
          {
            path: 'contacts',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/contacts/contacts.routes'),
          },
          {
            path: 'ecommerce',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/ecommerce/ecommerce.routes'),
          },
          {
            path: 'file-manager',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/file-manager/file-manager.routes'),
          },
          {
            path: 'help-center',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/help-center/help-center.routes'),
          },
          {
            path: 'mailbox',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/mailbox/mailbox.routes'),
          },
          {
            path: 'notes',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/notes/notes.routes'),
          },
          {
            path: 'scrumboard',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/scrumboard/scrumboard.routes'),
          },
          {
            path: 'tasks',
            loadChildren: () =>
              import('@/app/domains/admin/modules/apps/tasks/tasks.routes'),
          },
        ],
      },

      // Pages
      {
        path: 'pages',
        children: [
          // Activities
          {
            path: 'activities',
            loadChildren: () =>
              import('@/app/domains/admin/modules/pages/activities/activities.routes'),
          },

          // Authentication
          {
            path: 'authentication',
            loadChildren: () =>
              import('@/app/domains/admin/modules/pages/authentication/authentication.routes'),
          },

          // Coming Soon
          {
            path: 'coming-soon',
            loadChildren: () =>
              import('@/app/domains/admin/modules/pages/coming-soon/coming-soon.routes'),
          },

          // Error
          {
            path: 'error',
            children: [
              {
                path: '404',
                loadChildren: () =>
                  import('@/app/domains/admin/modules/pages/error/error-404/error-404.routes'),
              },
              {
                path: '500',
                loadChildren: () =>
                  import('@/app/domains/admin/modules/pages/error/error-500/error-500.routes'),
              },
            ],
          },

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
                      import('@/app/domains/admin/modules/pages/invoice/printable/compact/compact.routes'),
                  },
                  {
                    path: 'modern',
                    loadChildren: () =>
                      import('@/app/domains/admin/modules/pages/invoice/printable/modern/modern.routes'),
                  },
                ],
              },
            ],
          },

          // Maintenance
          {
            path: 'maintenance',
            loadChildren: () =>
              import('@/app/domains/admin/modules/pages/maintenance/maintenance.routes'),
          },

          // Pricing
          {
            path: 'pricing',
            children: [
              {
                path: 'modern',
                loadChildren: () =>
                  import('@/app/domains/admin/modules/pages/pricing/modern/modern.routes'),
              },
              {
                path: 'simple',
                loadChildren: () =>
                  import('@/app/domains/admin/modules/pages/pricing/simple/simple.routes'),
              },
              {
                path: 'single',
                loadChildren: () =>
                  import('@/app/domains/admin/modules/pages/pricing/single/single.routes'),
              },
              {
                path: 'table',
                loadChildren: () =>
                  import('@/app/domains/admin/modules/pages/pricing/table/table.routes'),
              },
            ],
          },

          // Profile
          {
            path: 'profile',
            loadChildren: () =>
              import('@/app/domains/admin/modules/pages/profile/profile.routes'),
          },

          // Settings
          {
            path: 'settings',
            loadChildren: () =>
              import('@/app/domains/admin/modules/pages/settings/settings.routes'),
          },
        ],
      },

      // 404 & Catch all
      {
        path: '404-not-found',
        pathMatch: 'full',
        loadChildren: () =>
          import('@/app/domains/admin/modules/pages/error/error-404/error-404.routes'),
      },
      { path: '**', redirectTo: '404-not-found' },
    ],
  },*/
];
