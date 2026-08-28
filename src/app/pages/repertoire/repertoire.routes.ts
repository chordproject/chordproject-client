import { Routes } from '@angular/router';
import { RepertoireComponent } from './repertoire.component';
import { RepertoireDetailComponent } from './detail/repertoire-detail.component';
import { RepertoireLiveComponent } from './live/repertoire-live.component';

export default [
    {
        path: ':uid/live',
        component: RepertoireLiveComponent,
    },
    {
        path: ':uid',
        component: RepertoireDetailComponent,
    },
    {
        path: '',
        component: RepertoireComponent,
    },
] as Routes;
