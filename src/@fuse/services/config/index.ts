import { Injectable, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Theming } from 'app/core/theming/theming';

export type FuseConfig = {
    scheme: 'auto' | 'dark' | 'light';
};

@Injectable({ providedIn: 'root' })
export class FuseConfigService {
    private readonly _theming = inject(Theming);

    readonly config$ = toObservable(this._theming.scheme).pipe(
        map((scheme) => ({
            scheme: scheme === 'system' ? 'auto' : scheme,
        }))
    );
}