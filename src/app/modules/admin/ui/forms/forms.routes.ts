import { Routes } from '@angular/router';
import { FormsFieldsComponent } from './fields/fields.component';
import { FormsLayoutsComponent } from './layouts/layouts.component';
import { FormsWizardsComponent } from './wizards/wizards.component';

export default [
    {
        path: 'fields',
        component: FormsFieldsComponent,
    },
    {
        path: 'layouts',
        component: FormsLayoutsComponent,
    },
    {
        path: 'wizards',
        component: FormsWizardsComponent,
    },
] as Routes;
