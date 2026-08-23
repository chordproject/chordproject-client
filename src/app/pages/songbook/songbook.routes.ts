import { Routes } from '@angular/router';
import { SongbookComponent } from './songbook.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: '/library',
    },
    {
        path: ':uid',
        component: SongbookComponent,
    },
] as Routes;
