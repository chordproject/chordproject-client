import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsService } from './analytics.service';

export default [
  {
    path: '',
    component: AnalyticsComponent,
    resolve: {
      data: () => inject(AnalyticsService).getData(),
    },
  },
] as Routes;
