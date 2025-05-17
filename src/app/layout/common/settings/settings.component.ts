import { NgClass } from '@angular/common';
import {
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    FuseConfig,
    FuseConfigService,
    Scheme,
    Theme,
    Themes,
} from '@fuse/services/config';
import { TranslocoService } from '@jsverse/transloco';

import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatIconModule, MatButtonModule, NgClass, MatTooltipModule],
})
export class SettingsComponent implements OnInit, OnDestroy {
    @Output() closeSettings = new EventEmitter<void>();

    config: FuseConfig;
    scheme: 'auto' | 'dark' | 'light';
    theme: string;
    themes: Themes;
    activeLang: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _translocoService: TranslocoService
    ) {}

    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                // Store the config
                this.config = config;
            });

        // Subscribe to language changes
        this._translocoService.langChanges$.subscribe((activeLang) => {
            // Get the active lang
            this.activeLang = activeLang;
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    setScheme(scheme: Scheme): void {
        this._fuseConfigService.config = { scheme };
    }

    setTheme(theme: Theme): void {
        this._fuseConfigService.config = { theme };
    }

    setActiveLang(lang: string): void {
        this._translocoService.setActiveLang(lang);
    }
}
