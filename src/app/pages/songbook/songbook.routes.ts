import { Routes } from '@angular/router';
import { SongbookComponent } from './songbook.component';

export default [
    {
        path: ':uid',
        component: SongbookComponent,
    },
] as Routes;
