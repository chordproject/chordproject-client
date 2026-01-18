import { Routes } from '@angular/router';
import { NotesListComponent } from './list/list.component';
import { NotesComponent } from './notes.component';

export default [
  {
    path: '',
    component: NotesComponent,
    children: [
      {
        path: '',
        component: NotesListComponent,
      },
    ],
  },
] as Routes;
