import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChpViewerToolbarComponent } from 'app/components/viewer/viewer-toolbar/viewer-toolbar.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { Song } from 'app/models/song';
import { Songbook } from 'app/models/songbook';
import { Tag } from 'app/models/tag';
import { JoinPipe } from 'app/pipes/join.pipe';

@Component({
    selector: 'song-reader',
    standalone: true,
    templateUrl: './song-reader.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatSidenavModule,
        RouterOutlet,
        JoinPipe,
        ChpViewerToolbarComponent,
        ChpViewerComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        AsyncPipe,
        MatIconModule,
        TranslocoModule,
    ],
})
export class SongReaderComponent implements OnInit, OnDestroy {
    song: Song = null;
    songLoadError = false;
    associatedSongbooks: Songbook[] = [];
    associatedTags: Tag[] = [];
    drawerMode: 'side' | 'over';
    deviceType: 'phone' | 'tablet' | 'desktop' = 'desktop';
    songbookSearchControl: UntypedFormControl = new UntypedFormControl('');
    filteredSongbooks$: Observable<Songbook[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _songService: SongService,
        private _songbookService: SongbookService,
        private route: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    ngOnInit(): void {
        this.drawerMode = 'over';
        this.loadSong();
        this.setupSongbookSearch();

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
                    const uid = params.get('uid')?.trim();
                    if (uid) {
                        return this._songService.get(uid).pipe(catchError(() => of(null)));
                    }
                    return of(null);
                })
            )
            .subscribe((data) => {
                this.song = data;
                this.songLoadError = !data;
                this.associatedSongbooks = [];
                this.associatedTags = [];
                if (data?.uid) {
                    this._songbookService
                        .getSongbooksForSong(data.uid)
                        .pipe(takeUntil(this._unsubscribeAll), catchError(() => of([])))
                        .subscribe((songbooks) => {
                            this.associatedSongbooks = songbooks;
                            this._changeDetectorRef.markForCheck();
                        });
                }
                const songTags = data?.tags ?? [];
                if (songTags.length) {
                    this._songService
                        .getTags()
                        .pipe(takeUntil(this._unsubscribeAll), catchError(() => of([])))
                        .subscribe((tags) => {
                            this.associatedTags = tags.filter((tag) => songTags.includes(tag.id));
                            this._changeDetectorRef.markForCheck();
                        });
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    get viewerContent(): string {
        return this.song?.content || this.song?.lyrics || '';
    }

    private setupSongbookSearch(): void {
        this.filteredSongbooks$ = this.songbookSearchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap((value: string | Songbook) => {
                const searchTerm =
                    typeof value === 'string'
                        ? value
                        : value?.name ?? '';

                return this._songbookService
                    .searchSongbooks(searchTerm.trim(), 8)
                    .pipe(catchError(() => of([])));
            })
        );
    }

    displaySongbook(value: Songbook | string | null): string {
        if (!value) {
            return '';
        }

        return typeof value === 'string' ? value : value.name || '';
    }

    async addCurrentSongToSongbook(songbook: Songbook): Promise<void> {
        if (!this.song?.uid || !songbook?.uid) {
            return;
        }

        await this._songbookService.addSong(songbook.uid, this.song.uid);
        this.loadAssociatedSongbooks();
        this.songbookSearchControl.setValue('');
    }

    editSong(): void {
        if (this.song?.uid) {
            this._router.navigate(['/songs/create', this.song.uid]);
        }
    }

    toggleFullScreen(): void {}
    toggleSettings(): void {}

    removeSongFromSongbook(songbook: Songbook): void {
        if (!this.song?.uid || !songbook?.uid) {
            return;
        }

        this._songbookService.removeSong(songbook.uid, this.song.uid).then((removed) => {
            if (removed) {
                this.loadAssociatedSongbooks();
            }
        });
    }

    private loadAssociatedSongbooks(): void {
        if (!this.song?.uid) {
            this.associatedSongbooks = [];
            return;
        }

        this._songbookService
            .getSongbooksForSong(this.song.uid)
            .pipe(takeUntil(this._unsubscribeAll), catchError(() => of([])))
            .subscribe((songbooks) => {
                this.associatedSongbooks = songbooks;
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
