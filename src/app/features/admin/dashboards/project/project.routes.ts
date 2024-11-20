import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ProjectComponent } from './project.component';
import { ProjectService } from './project.service';

export default [
    {
        path: '',
        component: ProjectComponent,
        resolve: {
            data: () => inject(ProjectService).getData(),
        },
    },
] as Routes;
