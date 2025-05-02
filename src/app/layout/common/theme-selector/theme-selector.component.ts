import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseConfig, FuseConfigService, Scheme } from '@fuse/services/config';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'theme-selector',
    templateUrl: './theme-selector.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'theme-selector',
    imports: [MatButtonModule, MatIconModule],
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
    config: FuseConfig;
    isDarkMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(PLATFORM_ID) private _platformId: Object,
        @Inject(DOCUMENT) private _document: Document
    ) {}

    ngOnInit(): void {
        // Initial check for dark mode from body class
        if (isPlatformBrowser(this._platformId)) {
            this.isDarkMode = this._document.body.classList.contains('dark');
        }

        // Subscribe to config changes for ongoing updates
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: FuseConfig) => {
                this.config = config;
                this.updateDarkModeState();
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Update dark mode state based on the current scheme
     */
    private updateDarkModeState(): void {
        if (this.config.scheme === 'dark') {
            this.isDarkMode = true;
        } else if (this.config.scheme === 'light') {
            this.isDarkMode = false;
        } else if (this.config.scheme === 'auto') {
            // For auto mode, check both system preference and actual applied theme
            if (isPlatformBrowser(this._platformId)) {
                // First priority: check the actual body class as this is what's actually applied
                const bodyHasDarkClass =
                    this._document.body.classList.contains('dark');

                // Second priority: check system preference
                const systemPrefersDark = this.getSystemPrefersDarkMode();

                // Use the body class if it exists, otherwise use system preference
                this.isDarkMode = bodyHasDarkClass || systemPrefersDark;
            }
        }
    }

    /**
     * Check if system prefers dark mode
     */
    private getSystemPrefersDarkMode(): boolean {
        if (isPlatformBrowser(this._platformId)) {
            return (
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
            );
        }
        return false;
    }

    toggleTheme(): void {
        let scheme: Scheme;

        // If current scheme is auto, switch to a specific mode based on current state
        if (this.config.scheme === 'auto') {
            scheme = this.isDarkMode ? 'light' : 'dark';
        } else {
            // Toggle between light and dark
            scheme = this.config.scheme === 'dark' ? 'light' : 'dark';
        }

        this._fuseConfigService.config = { scheme };
    }
}
