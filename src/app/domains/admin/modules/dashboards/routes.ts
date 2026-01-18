import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AnalyticsComponent } from '@/app/domains/admin/modules/dashboards/features/analytics/analytics.component';
import { AnalyticsService } from '@/app/domains/admin/modules/dashboards/features/analytics/analytics.service';
import { FinanceComponent } from '@/app/domains/admin/modules/dashboards/features/finance/finance.component';
import { FinanceService } from '@/app/domains/admin/modules/dashboards/features/finance/finance.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'project',
  },
  {
    path: 'project',
    loadComponent: () => import('./features/project/project'),
  },
  {
    path: 'analytics',
    component: AnalyticsComponent,
    resolve: {
      data: () => inject(AnalyticsService).getData(),
    },
  },
  {
    path: 'finance',
    component: FinanceComponent,
    resolve: {
      data: () => inject(FinanceService).getData(),
    },
  },
  /*{
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics'),
  },
  {
    path: 'finance',
    loadComponent: () => import('./features/finance/finance'),
  },*/
];

export default routes;
