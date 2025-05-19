import { Routes } from '@angular/router';
import { SongEditorComponent } from './song-editor.component';

export default [
    {
        path: 'create',
        children: [
            {
                path: '',
                component: SongEditorComponent,
                data: { mode: 'create' },
            },
            {
                path: ':uid',
                component: SongEditorComponent,
                data: { mode: 'create' },
            },
        ],
    },
    {
        path: 'read/:uid',
        component: SongEditorComponent,
        data: { mode: 'reader' },
    },
] as Routes;
