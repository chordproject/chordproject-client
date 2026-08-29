import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChpViewerToolbarComponent } from 'app/components/viewer/viewer-toolbar/viewer-toolbar.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';

/**
 * `chp-viewer-toolbar` + `chp-viewer`, wired together with responsive device-type
 * detection (bottom sticky toolbar on phone, inline on tablet/desktop). Shared by
 * the song reader page and the reusable song preview so both stay in sync.
 */
@Component({
    selector: 'chp-viewer-panel',
    standalone: true,
    templateUrl: './viewer-panel.component.html',
    imports: [ChpViewerToolbarComponent, ChpViewerComponent],
})
export class ChpViewerPanelComponent implements OnInit, OnDestroy {
    @Input() song: Song | PartialSong;
    @Input() content: string;
    @Input() isPreview = false;
    @Input() compactPreview = false;
    @Input() showEditDelete = true;
    @Input() showDelete = true;
    @Input() centerContent = false;

    @Output() editSongEvent = new EventEmitter<void>();
    @Output() deleteSongEvent = new EventEmitter<void>();

    deviceType: 'phone' | 'tablet' | 'desktop' = 'desktop';
    private readonly _unsubscribeAll = new Subject<void>();

    constructor(
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                if (matchingAliases.includes('lg')) {
                    this.deviceType = 'desktop';
                } else if (matchingAliases.includes('md')) {
                    this.deviceType = 'tablet';
                } else {
                    this.deviceType = 'phone';
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
