import { Routes } from '@angular/router';
import { authGuard } from 'app/core/user/auth.guard';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },

      {
        path: 'home',
        loadChildren: () => import('app/pages/home/home.routes'),
      },
      {
        path: 'library',
        loadChildren: () => import('app/pages/library/library.routes'),
      },
      {
        path: 'songs',
        children: [
          {
            path: '',
            loadChildren: () => import('app/pages/song-editor/song-editor.routes'),
          },
          {
            path: '',
            loadChildren: () => import('app/pages/song-reader/song-reader.routes'),
          },
        ],
      },
      {
        path: 'songbook',
        loadChildren: () => import('app/pages/songbook/songbook.routes'),
      },
      {
        path: 'repertoires',
        loadChildren: () => import('app/pages/repertoire/repertoire.routes'),
      },
      {
        path: 'suggestions',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/suggestions/routes'),
      },
      {
        path: 'feedback',
        canActivate: [authGuard],
        loadChildren: () => import('./modules/feedback/routes'),
      },
      {
        path: 'group',
        canActivate: [authGuard],
        loadComponent: () => import('app/pages/music-group/music-group.component'),
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
