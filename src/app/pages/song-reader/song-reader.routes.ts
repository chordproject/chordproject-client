import { Routes } from '@angular/router';
import { SongReaderComponent } from './song-reader.component';

export default [
    {
        path: 'read/:uid',
        component: SongReaderComponent,
        data: { mode: 'reader' },
    },
] as Routes;
