import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AngularSplitModule } from 'angular-split';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'chp-split-layout',
    standalone: true,
    templateUrl: './split-layout.component.html',
    imports: [CommonModule, AngularSplitModule, MatIconModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChpSplitLayoutComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @Input() leftTemplate: TemplateRef<any>;
    @Input() rightTemplate: TemplateRef<any>;

    @Output() isMobileChange = new EventEmitter<boolean>();

    isDarkMode: boolean;
    isMobile: boolean;
    showPrimaryArea = true;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfigService: FuseConfigService
    ) {}

    ngOnInit(): void {
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                let newDarkTheme = config.scheme === 'dark';
                if (config.scheme === 'auto') {
                    newDarkTheme = document.body.classList.contains('dark');
                }
                if (this.isDarkMode !== newDarkTheme) {
                    this.isDarkMode = newDarkTheme;
                    this._changeDetectorRef.markForCheck();
                }
            });

        // Listen for media query changes
        this._fuseMediaWatcherService
            .onMediaQueryChange$('(max-width: 959px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                this.isMobile = state.matches;
                this.isMobileChange.emit(this.isMobile);
                if (!this.isMobile) {
                    this.showPrimaryArea = true;
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    togglePreview(): void {
        this.showPrimaryArea = !this.showPrimaryArea;
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
