import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AngularSplitModule } from 'angular-split';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'editor',
    templateUrl: './editor-page.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AngularSplitModule,
        MatCardModule,
        MatIconModule,
        ChpViewerComponent,
        ChpEditorComponent,
    ],
})
export class EditorPageComponent implements OnInit, OnDestroy {
    songContent = 'dasdsa';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
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

        this._fuseMediaWatcherService
            .onMediaQueryChange$('(max-width: 959px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                this.isMobile = state.matches;
                if (!this.isMobile) {
                    this.showPrimaryArea = true;
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    togglePreview(): void {
        this.showPrimaryArea = !this.showPrimaryArea;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
