import { Routes } from '@angular/router';
import { RepertoireDetailComponent } from './detail/repertoire-detail.component';
import { RepertoireLiveComponent } from './live/repertoire-live.component';
import { RepertoireComponent } from './repertoire.component';
import { RepertoireSettingsComponent } from './settings/repertoire-settings.component';

export default [
    {
        path: 'settings',
        component: RepertoireSettingsComponent,
    },
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
