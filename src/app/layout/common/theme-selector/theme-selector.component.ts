import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FuseConfig, FuseConfigService, Scheme } from '@fuse/services/config';
import { Subject } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'theme-selector',
    templateUrl: './theme-selector.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'theme-selector',
    imports: [
        MatButtonModule,
        MatIconModule,
    ],
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
    config: FuseConfig;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _fuseConfigService: FuseConfigService,
    ) { }

    ngOnInit(): void {
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                this.config = config;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    toggleTheme(): void {
        let scheme = 'dark' as Scheme;
        if (this.config.scheme === 'dark') {
            scheme = 'light';
        }

        this._fuseConfigService.config = { scheme };
    }
}
