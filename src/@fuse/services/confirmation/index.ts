import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export type FuseConfirmationConfig = {
    title?: string;
    message?: string;
    actions?: {
        confirm?: {
            label?: string;
        };
        cancel?: {
            label?: string;
        };
    };
};

export type FuseConfirmationRef = {
    afterClosed: () => Observable<'confirmed' | 'cancelled'>;
};

@Injectable({ providedIn: 'root' })
export class FuseConfirmationService {
    open(config: FuseConfirmationConfig): FuseConfirmationRef {
        const confirmed = globalThis.confirm?.(
            config.message ?? config.title ?? 'Are you sure?'
        );

        return {
            afterClosed: () => of(confirmed ? 'confirmed' : 'cancelled'),
        };
    }
}