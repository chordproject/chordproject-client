import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

type FuseMediaChange = {
    matchingAliases: string[];
    matchingQueries: Record<string, string>;
};

@Injectable({ providedIn: 'root' })
export class FuseMediaWatcherService {
    private readonly _breakpointObserver = inject(BreakpointObserver);
    private readonly _breakpoints: Record<string, string> = {
        sm: '(min-width: 600px)',
        md: '(min-width: 960px)',
        lg: '(min-width: 1280px)',
        xl: '(min-width: 1440px)',
    };

    readonly onMediaChange$: Observable<FuseMediaChange> =
        this._breakpointObserver.observe(Object.values(this._breakpoints)).pipe(
            map((state) => {
                const matchingAliases = Object.entries(this._breakpoints)
                    .filter(([, query]) => state.breakpoints[query])
                    .map(([alias]) => alias);

                return {
                    matchingAliases,
                    matchingQueries: this._breakpoints,
                };
            })
        );

    onMediaQueryChange$(query: string): Observable<{ matches: boolean }> {
        return this._breakpointObserver.observe(query).pipe(
            map((state) => ({ matches: state.matches }))
        );
    }
}