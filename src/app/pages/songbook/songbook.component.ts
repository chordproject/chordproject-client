import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { ChpSongItemComponent } from 'app/components/song-item/song-item.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { PartialSong } from 'app/models/partialsong';
import { Songbook } from 'app/models/songbook';

@Component({
    selector: 'chp-songbook',
    standalone: true,
    templateUrl: './songbook.component.html',
    imports: [CommonModule, DragDropModule, ChpViewerComponent, ChpSongItemComponent, ChpSplitLayoutComponent],
})
export class SongbookComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedSong = signal<PartialSong | null>(null);
    songbookLoadError = signal(false);
    songsLoadError = signal(false);

    @ViewChild(ChpSplitLayoutComponent) splitLayout: ChpSplitLayoutComponent;

    songbook$: Observable<Songbook>;
    songs$: Observable<PartialSong[]>;
    songsList = signal<PartialSong[]>([]);

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _songbookService: SongbookService
    ) {}

    ngOnInit(): void {
        this.loadSongbook();
        this.loadSongs();
    }

    private loadSongbook(): void {
        this.songbook$ = this._route.paramMap.pipe(
            switchMap((params) => {
                this.songbookLoadError.set(false);
                return this._songbookService.get(params.get('uid')).pipe(
                    catchError(() => {
                        this.songbookLoadError.set(true);
                        return of(null);
                    })
                );
            }),
            takeUntil(this._unsubscribeAll),
        );
    }

    private loadSongs(): void {
        this.songs$ = this._route.paramMap.pipe(
            takeUntil(this._unsubscribeAll),
            switchMap((params) => {
                // Reset selected song when route changes
                this.selectedSong.set(null);
                this.songsLoadError.set(false);
                return this._songbookService.getContent(params.get('uid')).pipe(
                    catchError(() => {
                        this.songsLoadError.set(true);
                        return of([]);
                    })
                );
            })
        );

        this.songs$.pipe(takeUntil(this._unsubscribeAll)).subscribe((songs) => {
            this.songsList.set([...songs]);
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onDrop(event: CdkDragDrop<PartialSong[]>) {
        if (event.previousIndex === event.currentIndex) {
            return;
        }

        const updatedSongs = [...this.songsList()];

        // Actualizar la UI inmediatamente
        moveItemInArray(updatedSongs, event.previousIndex, event.currentIndex);
        this.songsList.set(updatedSongs);

        // Preparar datos para BD
        const songOrders = this.songsList().map((song, index) => ({
            songId: song.uid,
            order: index,
        }));

        // Actualizar en Firebase sin recargar después
        const songbookId = this._route.snapshot.paramMap.get('uid');
        this._songbookService.updateSongOrder(songbookId, songOrders).pipe(takeUntil(this._unsubscribeAll)).subscribe();
    }

    selectSong(song: PartialSong): void {
        this.selectedSong.set(song);

        // If we're in mobile mode, toggle the preview to show the right panel
        if (this.splitLayout?.isMobile) {
            this.splitLayout.togglePreview();
        }
    }

    onDblClick(song: PartialSong): void {
        this._router.navigate(['/songs/read', song.uid]);
    }

    trackByFn(index: number, item: any): any {
        return item.uid || index;
    }
}
