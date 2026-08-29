import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { SongService } from 'app/core/firebase/api/song.service';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { SongsListComponent } from './list/list.component';

@Component({
    selector: 'library',
    standalone: true,
    templateUrl: './library.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ChpSplitLayoutComponent, ChpSongPreviewComponent, SongsListComponent],
})
export class LibraryComponent implements OnDestroy {
    @ViewChild(ChpSplitLayoutComponent) splitLayout: ChpSplitLayoutComponent;

    selectedSong: Song | null = null;
    private _unsubscribeAll = new Subject<void>();

    constructor(
        private _songService: SongService,
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}

    selectSong(song: PartialSong): void {
        if (this.selectedSong?.uid !== song.uid) {
            this._songService
                .get(song.uid)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe((fullSong) => {
                    this.selectedSong = { ...fullSong, tags: fullSong?.tags ?? [] };
                    this._changeDetectorRef.markForCheck();
                });
        }

        if (this.splitLayout?.isMobile) {
            this.splitLayout.togglePreview();
        }
    }

    closePreview(): void {
        this.selectedSong = null;
    }

    openFullEditor(): void {
        if (this.selectedSong?.uid) {
            this._router.navigate(['/songs/create', this.selectedSong.uid]);
        }
    }

    onDblClick(song: PartialSong): void {
        this._router.navigate(['/songs/read', song.uid]);
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

