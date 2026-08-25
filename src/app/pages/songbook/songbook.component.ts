import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { ChpSongItemComponent } from 'app/components/song-item/song-item.component';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer/viewer.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongbookSuggestionService } from 'app/core/firebase/api/songbook-suggestion.service';
import { UserService } from 'app/core/user/user.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Song } from 'app/models/song';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { PartialSong } from 'app/models/partialsong';
import { Songbook } from 'app/models/songbook';
import { SongbookSuggestionDialogComponent } from './songbook-suggestion-dialog.component';

@Component({
    selector: 'chp-songbook',
    standalone: true,
    templateUrl: './songbook.component.html',
    imports: [CommonModule, DragDropModule, MatIconModule, RouterLink, TranslocoModule, ChpEditorComponent, ChpSongPreviewComponent, ChpSongItemComponent, ChpSplitLayoutComponent],
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
    childSongbooks$: Observable<Songbook[]>;
    songsList = signal<PartialSong[]>([]);
    childSongbooks = signal<Songbook[]>([]);
    editingPreview = signal(false);
    isAuthenticated;
    previewContent = '';

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _songbookService: SongbookService,
        private _songbookSuggestionService: SongbookSuggestionService,
        private _songService: SongService,
        private _userService: UserService,
        private _translocoService: TranslocoService,
        private _confirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _editorService: EditorService
    ) {
        this.isAuthenticated = toSignal(this._userService.isAuthenticated(), { initialValue: false });
    }

    ngOnInit(): void {
        this.loadSongbook();
        this.loadSongs();
        this.loadChildSongbooks();
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

    private loadChildSongbooks(): void {
        this.childSongbooks$ = this._route.paramMap.pipe(
            takeUntil(this._unsubscribeAll),
            switchMap((params) =>
                this._songbookService.getChildren(params.get('uid')).pipe(
                    catchError(() => of([]))
                )
            )
        );

        this.childSongbooks$.pipe(takeUntil(this._unsubscribeAll)).subscribe((songbooks) => {
            this.childSongbooks.set([...songbooks]);
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

        const currentSongbook = this.currentSongbook();
        if (!currentSongbook || !this.isEditable(currentSongbook)) {
            return;
        }

        if (this.requiresCustomizationConfirmation(currentSongbook)) {
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
                        this.applyDrop(event, currentSongbook);
                    }
                });
            return;
        }

        this.applyDrop(event, currentSongbook);
    }

    private applyDrop(event: CdkDragDrop<PartialSong[]>, currentSongbook: Songbook): void {
        if (!currentSongbook.uid) {
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
        this._songbookService.updateSongOrder(currentSongbook.uid, songOrders).pipe(takeUntil(this._unsubscribeAll)).subscribe((updated) => {
            if (updated && this.requiresCustomizationConfirmation(currentSongbook)) {
                this.currentSongbook.set({
                    ...currentSongbook,
                    syncStatus: 'customized',
                });
            }
        });
    }

    selectSong(song: PartialSong): void {
        this.selectedSong.set(song);

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

    createCopy(songbook: Songbook): void {
        if (!songbook.uid) {
            return;
        }

        const songbookIds = [songbook.uid, ...this.childSongbooks().map((child) => child.uid)].filter(Boolean);
        this._songbookService
            .forkMany(songbookIds)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((songbookIds) => {
                if (songbookIds.length > 0) {
                    this._router.navigate(['/songbook', songbookIds[0]]);
                }
            });
    }

    suggestChange(songbook: Songbook): void {
        this._matDialog.open(SongbookSuggestionDialogComponent, {
            autoFocus: false,
            data: {
                songbook,
                hasChildren: this.childSongbooks().length > 0,
            },
        })
            .afterClosed()
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((result) => {
                    if (!result) {
                        return of(null);
                    }

                    return this._songbookSuggestionService.create({
                        ...result,
                        targetSongbookId: songbook.uid,
                        targetParentId: result.type === 'new_child_songbook' ? songbook.uid : undefined,
                    });
                })
            )
            .subscribe((suggestionId) => {
                if (suggestionId) {
                    this._translocoService
                        .selectTranslate('songbook_suggestion.sent')
                        .pipe(
                            switchMap((message) =>
                                this._translocoService
                                    .selectTranslate('common.close')
                                    .pipe(map((closeLabel) => ({ message, closeLabel })))
                            ),
                            take(1)
                        )
                        .subscribe(({ message, closeLabel }) => {
                            this._snackBar.open(message, closeLabel, {
                                duration: 3000,
                                horizontalPosition: 'center',
                                verticalPosition: 'bottom',
                            });
                        });
                }
            });
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
