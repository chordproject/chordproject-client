import { Routes } from '@angular/router';
import { WebLayout } from '@/app/domains/website/layout/layout';

const routes: Routes = [
  {
    path: '',
    component: WebLayout,
    children: [
      // Redirect empty path to 'home'
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },

      // -----------------------------------------------------------------------
      // Home
      // -----------------------------------------------------------------------
      {
        path: '',
        loadChildren: () => import('./modules/home/routes'),
      },

      // Catch all
      { path: '**', redirectTo: '/' },
    ],
  },
];

export default routes;
