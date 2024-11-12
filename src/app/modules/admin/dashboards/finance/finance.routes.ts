import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { FinanceComponent } from './finance.component';
import { FinanceService } from './finance.service';

export default [
    {
        path: '',
        component: FinanceComponent,
        resolve: {
            data: () => inject(FinanceService).getData(),
        },
    },
] as Routes;
