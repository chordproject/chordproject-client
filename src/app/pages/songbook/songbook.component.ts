import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { ChpSongListPanelComponent } from 'app/components/song-list-panel/song-list-panel.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { UserService } from 'app/core/user/user.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Song } from 'app/models/song';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { PartialSong } from 'app/models/partialsong';
import { Songbook } from 'app/models/songbook';

@Component({
    selector: 'chp-songbook',
    standalone: true,
    templateUrl: './songbook.component.html',
    imports: [
        CommonModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterLink,
        TranslocoModule,
        ChpEditorComponent,
        ChpSongPreviewComponent,
        ChpSongListPanelComponent,
        ChpSplitLayoutComponent,
    ],
})
export class SongbookComponent implements OnInit, OnDestroy {
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    selectedSong = signal<PartialSong | null>(null);
    currentSongbook = signal<Songbook | null>(null);
    songbookLoadError = signal(false);
    songsLoadError = signal(false);

    @ViewChild(ChpSplitLayoutComponent) splitLayout: ChpSplitLayoutComponent;

    songbook$: Observable<Songbook>;
    songs$: Observable<PartialSong[]>;
    songsList = signal<PartialSong[]>([]);
    editingPreview = signal(false);
    isAuthenticated;
    previewContent = '';
    songSearchControl = new UntypedFormControl('');
    filteredSongs$: Observable<PartialSong[]>;
    addingSongId = signal<string | null>(null);

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _songbookService: SongbookService,
        private _songService: SongService,
        private _userService: UserService,
        private _confirmationService: FuseConfirmationService,
        private _editorService: EditorService
    ) {
        this.isAuthenticated = toSignal(this._userService.isAuthenticated(), { initialValue: false });
    }

    ngOnInit(): void {
        this.loadSongbook();
        this.loadSongs();
        this.setupSongSearch();
    }

    private setupSongSearch(): void {
        this.filteredSongs$ = this.songSearchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(250),
            distinctUntilChanged(),
            switchMap((value: string | PartialSong) => {
                const term = typeof value === 'string' ? value.trim() : '';
                return term.length >= 2 ? this._songService.searchByTitleContains(term, 15) : of([]);
            }),
            map((songs) => {
                const existingIds = new Set(this.songsList().map((song) => song.uid));
                return songs.filter((song) => !existingIds.has(song.uid));
            }),
            catchError(() => of([])),
            takeUntil(this._unsubscribeAll)
        );
    }

    displaySong(): string {
        // Always show the typed search term, never the selected song's title.
        return '';
    }

    addSongToSongbook(song: PartialSong): void {
        const currentSongbook = this.currentSongbook();
        if (!song?.uid || !currentSongbook?.uid || this.addingSongId()) {
            return;
        }

        this.confirmCustomizationIfNeeded(currentSongbook, async () => {
            this.addingSongId.set(song.uid);
            const relationId = await this._songbookService.addSong(currentSongbook.uid, song.uid);
            this.addingSongId.set(null);
            if (relationId) {
                this.songsList.set([...this.songsList(), song]);
                if (this.requiresCustomizationConfirmation(currentSongbook)) {
                    this.currentSongbook.set({ ...currentSongbook, syncStatus: 'customized' });
                }
            }
        });
        this.songSearchControl.setValue('');
    }

    private loadSongbook(): void {
        this.songbook$ = this._route.paramMap.pipe(
            switchMap((params) => {
                this.songbookLoadError.set(false);
                this.currentSongbook.set(null);
                return this._songbookService.get(params.get('uid')).pipe(
                    tap((songbook) => this.currentSongbook.set(songbook)),
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

    private confirmCustomizationIfNeeded(songbook: Songbook, action: () => void): void {
        if (!this.requiresCustomizationConfirmation(songbook)) {
            action();
            return;
        }

        this._confirmationService.open({
            title: 'Personalizar copia',
            message: 'Al modificar esta copia dejara de estar sincronizada con el cancionero recomendado original.',
            icon: {
                name: 'triangle-alert',
                color: 'primary',
            },
            actions: {
                confirm: {
                    label: 'Personalizar',
                    color: 'primary',
                },
                cancel: {
                    label: 'Cancelar',
                },
            },
        })
            .afterClosed()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((result) => {
                if (result === 'confirmed') {
                    action();
                }
            });
    }

    selectSong(song: PartialSong): void {
        this.selectedSong.set(song);

        // La lista viene del indice y no trae `content`; el detalle completo se pide al abrir.
        this._songService
            .get(song.uid)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((fullSong) => {
                if (this.selectedSong()?.uid === song.uid) {
                    this.selectedSong.set(fullSong);
                }
            });

        // If we're in mobile mode, toggle the preview to show the right panel
        if (this.splitLayout?.isMobile) {
            this.splitLayout.togglePreview();
        }
    }

    closePreview(): void {
        this.selectedSong.set(null);
        this.editingPreview.set(false);
    }

    isEditable(songbook: Songbook): boolean {
        return !(songbook.scope === 'shared' && songbook.published === true);
    }

    isRecommended(songbook: Songbook): boolean {
        return songbook.scope === 'shared' && songbook.published === true;
    }

    requiresCustomizationConfirmation(songbook: Songbook): boolean {
        return Boolean(songbook.copiedFrom) && songbook.syncStatus !== 'customized';
    }

    startQuickEdit(): void {
        const song = this.selectedSong();
        if (!song) {
            return;
        }

        this.previewContent = song.content || '';
        this.editingPreview.set(true);
    }

    closeQuickEdit(): void {
        this.editingPreview.set(false);
    }

    async saveQuickEdit(): Promise<void> {
        const selectedSong = this.selectedSong();
        if (!selectedSong?.uid) {
            return;
        }

        const updatedSong = this._editorService.prepareSongFromContent(this.previewContent);
        const savedSong = await this._songService.save({
            ...selectedSong,
            ...updatedSong,
        } as Song);

        if (savedSong) {
            this.selectedSong.set({
                ...selectedSong,
                ...updatedSong,
                content: this.previewContent,
            });
            this.editingPreview.set(false);
        }
    }

    removePreviewSong(): void {
        const selectedSong = this.selectedSong();
        if (!selectedSong) {
            return;
        }

        this._editorService.confirmAndDelete(selectedSong as Song).subscribe((success) => {
            if (success) {
                this.closePreview();
            }
        });
    }

    onDblClick(song: PartialSong): void {
        this._router.navigate(['/songs/read', song.uid]);
    }

    trackByFn(index: number, item: any): any {
        return item.uid || index;
    }
}
