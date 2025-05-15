import { Routes } from '@angular/router';
import { CreateComponent } from './create.component';

export default [
    {
        path: '',
        component: CreateComponent,
    },
    {
        path: ':uid',
        component: CreateComponent,
    },
] as Routes;
