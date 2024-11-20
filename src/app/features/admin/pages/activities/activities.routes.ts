import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ActivitiesComponent } from './activities.component';
import { ActivitiesService } from './activities.service';

export default [
    {
        path: '',
        component: ActivitiesComponent,
        resolve: {
            activities: () => inject(ActivitiesService).getActivities(),
        },
    },
] as Routes;
