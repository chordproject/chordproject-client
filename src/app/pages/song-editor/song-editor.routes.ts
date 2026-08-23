import { Routes } from '@angular/router';
import { SongEditorComponent } from './song-editor.component';

export default [
    {
        path: 'create',
        children: [
            {
                path: '',
                component: SongEditorComponent,
                canDeactivate: [(component: SongEditorComponent) => component.canDeactivate()],
            },
            {
                path: ':uid',
                component: SongEditorComponent,
                canDeactivate: [(component: SongEditorComponent) => component.canDeactivate()],
            },
        ],
    },
] as Routes;
