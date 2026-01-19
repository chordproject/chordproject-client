import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { IconsComponent } from './ui/icons/icons.component';
import { IconsService } from './ui/icons/icons.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'getting-started/introduction',
  },
  {
    path: '',
    loadComponent: () => import('./documentation-layout.component'),
    children: [
      {
        path: 'changelog',
        loadComponent: () => import('./changelog/changelog'),
      },
      {
        path: 'getting-started',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'introduction',
          },
          {
            path: 'introduction',
            loadComponent: () => import('./getting-started/introduction'),
          },
          {
            path: 'prerequisites',
            loadComponent: () => import('./getting-started/prerequisites'),
          },
          {
            path: 'installation',
            loadComponent: () => import('./getting-started/installation'),
          },
          {
            path: 'serving',
            loadComponent: () => import('./getting-started/serving'),
          },
        ],
      },
      {
        path: 'development',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'directory-structure',
          },
          {
            path: 'directory-structure',
            loadComponent: () => import('./development/directory-structure'),
          },
          {
            path: 'component-structure',
            loadComponent: () => import('./development/component-structure'),
          },
          {
            path: 'starter-kit',
            loadComponent: () => import('./development/starter-kit'),
          },
          {
            path: 'deployment',
            loadComponent: () => import('./development/deployment'),
          },
          {
            path: 'updating',
            loadComponent: () => import('./development/updating'),
          },
        ],
      },
      {
        path: 'customization',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'theme-layouts',
          },
          {
            path: 'theme-layouts',
            loadComponent: () => import('./customization/theme-layouts'),
          },
          {
            path: 'page-layouts',
            loadComponent: () => import('./customization/page-layouts'),
          },
          {
            path: 'tailwindcss',
            loadComponent: () => import('./customization/tailwindcss'),
          },
          {
            path: 'theming',
            loadComponent: () => import('./customization/theming'),
          },
          {
            path: 'component-theming',
            loadComponent: () => import('./customization/component-theming'),
          },
          {
            path: 'splash-screen',
            loadComponent: () => import('./customization/splash-screen'),
          },
          {
            path: 'multi-language',
            loadComponent: () => import('./customization/multi-language'),
          },
        ],
      },
      {
        path: 'ui',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'advanced-search',
          },
          {
            path: 'advanced-search',
            loadComponent: () => import('./ui/advanced-search/advanced-search'),
          },
          {
            path: 'animations',
            loadComponent: () => import('./ui/animations/animations'),
          },
          {
            path: 'cards',
            loadComponent: () => import('./ui/cards/cards'),
          },
          {
            path: 'colors',
            loadComponent: () => import('./ui/colors/colors'),
          },
          {
            path: 'confirmation-dialog',
            loadComponent: () =>
              import('./ui/confirmation-dialog/confirmation-dialog'),
          },
          {
            path: 'datatable',
            loadComponent: () => import('./ui/datatable/datatable'),
          },
          {
            path: 'forms',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'fields',
              },
              {
                path: 'fields',
                loadComponent: () => import('./ui/forms/fields/fields'),
              },
              {
                path: 'layouts',
                loadComponent: () => import('./ui/forms/layouts/layouts'),
              },
              {
                path: 'wizards',
                loadComponent: () => import('./ui/forms/wizards/wizards'),
              },
            ],
          },
          {
            path: 'icons',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'material-twotone',
              },
              {
                path: '**',
                component: IconsComponent,
                resolve: {
                  icons: (
                    route: ActivatedRouteSnapshot,
                    state: RouterStateSnapshot
                  ) => inject(IconsService).getIcons(state.url),
                },
              },
            ],
          },
          /*{
            path: 'page-layouts',
            loadChildren: () => import('./ui/page-layouts/page-layouts.routes'),
          },*/
          {
            path: 'typography',
            loadComponent: () => import('./ui/typography/typography'),
          },
        ],
      },
      {
        path: 'authentication',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'jwt',
          },
          {
            path: 'jwt',
            loadComponent: () => import('./authentication/jwt'),
          },
        ],
      },
      {
        path: 'components',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'components/angular-material-components',
          },
          {
            path: 'angular-material-components',
            loadComponent: () =>
              import('./components/angular-material-components'),
          },
          {
            path: 'fuse-components',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'libraries/mock-api',
              },
              {
                path: 'libraries',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'mock-api',
                  },
                  {
                    path: 'mock-api',
                    loadComponent: () =>
                      import('./components/fuse/libraries/mock-api'),
                  },
                ],
              },
              {
                path: 'components',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'alert',
                  },
                  {
                    path: 'alert',
                    loadComponent: () =>
                      import('./components/fuse/components/alert'),
                  },
                  {
                    path: 'card',
                    loadComponent: () =>
                      import('./components/fuse/components/card'),
                  },
                  {
                    path: 'fullscreen',
                    loadComponent: () =>
                      import('./components/fuse/components/fullscreen'),
                  },
                  {
                    path: 'highlight',
                    loadComponent: () =>
                      import('./components/fuse/components/highlight'),
                  },
                  {
                    path: 'loading-bar',
                    loadComponent: () =>
                      import('./components/fuse/components/loading-bar'),
                  },
                  {
                    path: 'masonry',
                    loadComponent: () =>
                      import('./components/fuse/components/masonry'),
                  },
                  {
                    path: 'navigation',
                    loadComponent: () =>
                      import('./components/fuse/components/navigation'),
                  },
                ],
              },
              {
                path: 'directives',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'scrollbar',
                  },
                  {
                    path: 'scrollbar',
                    loadComponent: () =>
                      import('./components/fuse/directives/scrollbar'),
                  },
                  {
                    path: 'scroll-reset',
                    loadComponent: () =>
                      import('./components/fuse/directives/scroll-reset'),
                  },
                ],
              },
              {
                path: 'services',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'config',
                  },
                  {
                    path: 'config',
                    loadComponent: () =>
                      import('./components/fuse/services/config'),
                  },
                  {
                    path: 'confirmation',
                    loadComponent: () =>
                      import('./components/fuse/services/confirmation'),
                  },
                  {
                    path: 'splash-screen',
                    loadComponent: () =>
                      import('./components/fuse/services/splash-screen'),
                  },
                  {
                    path: 'media-watcher',
                    loadComponent: () =>
                      import('./components/fuse/services/media-watcher'),
                  },
                ],
              },
              {
                path: 'pipes',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'find-by-key',
                  },
                  {
                    path: 'find-by-key',
                    loadComponent: () =>
                      import('./components/fuse/pipes/find-by-key'),
                  },
                ],
              },
              {
                path: 'validators',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'must-match',
                  },
                  {
                    path: 'must-match',
                    loadComponent: () =>
                      import('./components/fuse/validators/must-match'),
                  },
                ],
              },
            ],
          },
          {
            path: 'other-components',
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'common/overview',
              },
              {
                path: 'common',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'overview',
                  },
                  {
                    path: 'overview',
                    loadComponent: () =>
                      import('./components/other/common/overview'),
                  },
                  {
                    path: 'languages',
                    loadComponent: () =>
                      import('./components/other/common/languages'),
                  },
                  {
                    path: 'messages',
                    loadComponent: () =>
                      import('./components/other/common/messages'),
                  },
                  {
                    path: 'notifications',
                    loadComponent: () =>
                      import('./components/other/common/notifications'),
                  },
                  {
                    path: 'quick-chat',
                    loadComponent: () =>
                      import('./components/other/common/quick-chat'),
                  },
                  {
                    path: 'search',
                    loadComponent: () =>
                      import('./components/other/common/search'),
                  },
                  {
                    path: 'shortcuts',
                    loadComponent: () =>
                      import('./components/other/common/shortcuts'),
                  },
                  {
                    path: 'user',
                    loadComponent: () =>
                      import('./components/other/common/user'),
                  },
                ],
              },
              {
                path: 'third-party',
                children: [
                  {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'apex-charts',
                  },
                  {
                    path: 'apex-charts',
                    loadComponent: () =>
                      import('./components/other/third-party/apex-charts'),
                  },
                  {
                    path: 'quill-editor',
                    loadComponent: () =>
                      import('./components/other/third-party/quill-editor'),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
