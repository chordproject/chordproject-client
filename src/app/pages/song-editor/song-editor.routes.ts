import { Routes } from '@angular/router';
import { SongEditorComponent } from './song-editor.component';

export default [
    {
        path: 'create',
        children: [
            {
                path: '',
                component: SongEditorComponent,
            },
            {
                path: ':uid',
                component: SongEditorComponent,
            },
        ],
    },
] as Routes;
