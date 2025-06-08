import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChpViewerToolbarComponent } from 'app/components/viewer/viewer-toolbar/viewer-toolbar.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { SongService } from 'app/core/firebase/api/song.service';
import { Song } from 'app/models/song';
import { JoinPipe } from 'app/pipes/join.pipe';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'song-reader',
    standalone: true,
    templateUrl: './song-reader.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, MatSidenavModule, RouterOutlet, JoinPipe, ChpViewerToolbarComponent, ChpViewerComponent],
})
export class SongReaderComponent implements OnInit, OnDestroy {
    song: Song = null;
    drawerMode: 'side' | 'over';
    deviceType: 'phone' | 'tablet' | 'desktop';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _songService: SongService,
        private route: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    ngOnInit(): void {
        this.loadSong();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.deviceType = 'desktop';
                } else if (matchingAliases.includes('md')) {
                    this.deviceType = 'tablet';
                } else {
                    this.deviceType = 'phone';
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    loadSong(): void {
        this.route.paramMap
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((params) => {
                    const uid = params.get('uid');
                    if (uid) {
                        return this._songService.get(uid);
                    }
                    return [null]; // Emit null si no hay uid
                })
            )
            .subscribe((data) => {
                this.song = data;
                this._changeDetectorRef.markForCheck(); // Asegura la detección de cambios
            });
    }

    editSong(): void {
        if (this.song?.uid) {
            this._router.navigate(['/songs/create', this.song.uid]);
        }
    }

    toggleFullScreen(): void {}
    toggleSettings(): void {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
