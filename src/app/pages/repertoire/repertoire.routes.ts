import { Routes } from '@angular/router';
import { RepertoireComponent } from './repertoire.component';
import { RepertoireDetailComponent } from './detail/repertoire-detail.component';

export default [
    {
        path: ':uid',
        component: RepertoireDetailComponent,
    },
    {
        path: '',
        component: RepertoireComponent,
    },
] as Routes;
