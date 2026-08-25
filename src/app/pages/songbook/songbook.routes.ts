import { Routes } from '@angular/router';
import { SongbookListComponent } from './songbook-list.component';
import { SongbookComponent } from './songbook.component';

export default [
    {
        path: '',
        pathMatch: 'full',
        component: SongbookListComponent,
    },
    {
        path: ':uid',
        component: SongbookComponent,
    },
] as Routes;
