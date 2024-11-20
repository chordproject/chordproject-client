import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { CryptoComponent } from './crypto.component';
import { CryptoService } from './crypto.service';

export default [
    {
        path: '',
        component: CryptoComponent,
        resolve: {
            data: () => inject(CryptoService).getData(),
        },
    },
] as Routes;
