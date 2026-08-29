import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable, firstValueFrom, of, Subject, switchMap, takeUntil } from 'rxjs';
import { catchError, debounceTime, map, startWith, take } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChpViewerPanelComponent } from 'app/components/viewer/viewer-panel/viewer-panel.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongSuggestionService } from 'app/core/firebase/api/song-suggestion.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongbookSuggestionService } from 'app/core/firebase/api/songbook-suggestion.service';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { UserService } from 'app/core/user/user.service';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { SongSuggestion } from 'app/models/song-suggestion';
import { Songbook } from 'app/models/songbook';
import { SongbookSuggestion } from 'app/models/songbook-suggestion';
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
        ChpViewerPanelComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatAutocompleteModule,
        MatTooltipModule,
        RouterLink,
        AsyncPipe,
        MatIconModule,
        TranslocoModule,
    ],
})
export class SongReaderComponent implements OnInit, OnDestroy {
    song: Song = null;
    songLoadError = false;
    associatedSongbooks: Songbook[] = [];
    pendingSuggestion: SongSuggestion | null = null;
    versions: PartialSong[] = [];
    associatedTags: Tag[] = [];
    drawerMode: 'side' | 'over';
    songbookSearchControl: UntypedFormControl = new UntypedFormControl('');
    filteredSongbooks$: Observable<Songbook[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _songbookIdsBeingAdded = new Set<string>();
    private _songbookSuggestionIds = new Map<string, string>();
    private _pendingSongbooks: Songbook[] = [];

    get allVisibleSongbooks(): Songbook[] {
        return [...this.associatedSongbooks, ...this._pendingSongbooks];
    }

    get primarySongbooks(): Songbook[] {
        return this.allVisibleSongbooks.slice(0, 3);
    }

    get additionalSongbooks(): Songbook[] {
        return this.allVisibleSongbooks.slice(3);
    }

    isPendingSongbook(songbook: Songbook): boolean {
        return this._pendingSongbooks.some((pending) => pending.uid === songbook.uid);
    }

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _songService: SongService,
        private _songSuggestionService: SongSuggestionService,
        private _songbookSuggestionService: SongbookSuggestionService,
        private _songbookService: SongbookService,
        private _editorService: EditorService,
        private route: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _confirmationService: FuseConfirmationService,
        private _userService: UserService
    ) {}

    ngOnInit(): void {
        this.drawerMode = 'over';
        this.loadSong();
        this.setupSongbookSearch();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                this.drawerMode = matchingAliases.includes('lg') ? 'side' : 'over';
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
                this.pendingSuggestion = null;
                this.versions = [];
                this._pendingSongbooks = [];
                this._songbookSuggestionIds.clear();
                if (data?.uid) {
                    this._songbookService
                        .getSongbooksForSong(data.uid)
                        .pipe(takeUntil(this._unsubscribeAll), catchError(() => of([])))
                        .subscribe((songbooks) => {
                            this.associatedSongbooks = songbooks;
                            this.refreshSongbookSearch();
                            this._changeDetectorRef.markForCheck();
                        });

                    this._songSuggestionService
                        .getMineOpenForSong(data.uid)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((suggestion) => {
                            this.pendingSuggestion = suggestion;
                            this._changeDetectorRef.markForCheck();
                        });

                    this._songbookSuggestionService
                        .getMineOpenSongbookAssignments(data.uid)
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((suggestions) => {
                            const songbookIds = suggestions
                                .map((suggestion) => ({ id: suggestion.targetSongbookId, suggestionId: suggestion.uid }))
                                .filter((item) => Boolean(item.id));
                            Promise.all(songbookIds.map(async ({ id, suggestionId }) => {
                                const songbook = await firstValueFrom(this._songbookService.get(id));
                                return songbook ? { songbook, suggestionId } : null;
                            })).then((items) => {
                                items.filter(Boolean).forEach(({ songbook, suggestionId }) => {
                                    this._songbookSuggestionIds.set(songbook.uid, suggestionId);
                                    if (!this._pendingSongbooks.some((pending) => pending.uid === songbook.uid)) {
                                        this._pendingSongbooks = [...this._pendingSongbooks, songbook];
                                    }
                                });
                                this.refreshSongbookSearch();
                                this._changeDetectorRef.markForCheck();
                            });
                        });

                    const canonicalId = data.variantOf || data.uid;
                    this._songService
                        .getVariants(canonicalId)
                        .pipe(
                            takeUntil(this._unsubscribeAll),
                            switchMap((variants) =>
                                data.variantOf
                                    ? this._songService.getAll([canonicalId]).pipe(map((canonical) => [...canonical, ...variants]))
                                    : of(variants)
                            ),
                            catchError(() => of([]))
                        )
                        .subscribe((versions) => {
                            this.versions = [
                                data,
                                ...versions.filter((version) => version.uid !== data.uid),
                            ].sort((first, second) => {
                                const firstIsCanonical = first.uid === canonicalId;
                                const secondIsCanonical = second.uid === canonicalId;
                                return Number(secondIsCanonical) - Number(firstIsCanonical);
                            });
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
        if (this.pendingSuggestion?.proposedSong?.content) {
            return this.pendingSuggestion.proposedSong.content;
        }
        return this.song?.content || this.song?.lyrics || '';
    }

    versionLabel(version: PartialSong, index: number): string {
        return `Versión ${index + 1}`;
    }

    private setupSongbookSearch(): void {
        this.filteredSongbooks$ = this.songbookSearchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(200),
            switchMap((value: string | Songbook) => {
                const searchTerm =
                    typeof value === 'string'
                        ? value
                        : value?.name ?? '';

                return this._songbookService
                    .searchSongbooks(searchTerm.trim(), 8)
                    .pipe(
                        map((songbooks) => songbooks.filter((songbook) =>
                                !this.associatedSongbooks.some((associated) => associated.uid === songbook.uid)
                                && !this._songbookIdsBeingAdded.has(songbook.uid)
                                && !this._songbookSuggestionIds.has(songbook.uid)
                            ))
                    )
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

    songbookTypeLabel(songbook: Songbook): string {
        return songbook.scope === 'shared' && songbook.published === true
            ? 'reader.official_songbook'
            : 'reader.customized_songbook';
    }

    private refreshSongbookSearch(): void {
        this.songbookSearchControl.setValue(this.songbookSearchControl.value, { emitEvent: true });
    }

    addCurrentSongToSongbook(songbook: Songbook): void {
        if (!this.song?.uid || !songbook?.uid) {
            return;
        }

        this._songbookIdsBeingAdded.add(songbook.uid);
        this.songbookSearchControl.setValue('', { emitEvent: false });
        this._changeDetectorRef.markForCheck();

        this._userService
            .isAdmin()
            .pipe(
                take(1),
                switchMap((isAdmin) => {
                    // Non-admin public songbook: create suggestion
                    if (songbook.scope !== 'personal' && !isAdmin) {
                        return this._songbookSuggestionService
                            .getMineOpenForSongbookSong(songbook.uid, this.song!.uid)
                            .pipe(
                                take(1),
                                switchMap((existing) => {
                                    if (existing) {
                                        this._songbookSuggestionIds.set(songbook.uid, existing.uid);
                                        this._pendingSongbooks = [...this._pendingSongbooks, songbook];
                                        this._songbookIdsBeingAdded.delete(songbook.uid);
                                        this._changeDetectorRef.markForCheck();
                                        return of(true);
                                    }

                                    return this._songbookSuggestionService.create({
                                        type: 'add_song',
                                        targetSongbookId: songbook.uid,
                                        targetSongId: this.song!.uid,
                                        message: 'Solicitud para incluir esta canción en el cancionero.',
                                    }).pipe(
                                        take(1),
                                        map((suggestionId) => {
                                            if (suggestionId) {
                                                this._songbookSuggestionIds.set(songbook.uid, suggestionId);
                                                this._pendingSongbooks = [...this._pendingSongbooks, songbook];
                                            }
                                            this._songbookIdsBeingAdded.delete(songbook.uid);
                                            this._changeDetectorRef.markForCheck();
                                            return true;
                                        })
                                    );
                                })
                            );
                    }

                    // Admin or personal: add directly
                    this._songbookIdsBeingAdded.delete(songbook.uid);
                    return of(false);
                })
            )
            .subscribe((wasNotification) => {
                if (!wasNotification) {
                    // Personal or admin: proceed with direct add
                    this.confirmCustomizationIfNeeded(
                        songbook,
                        async () => {
                            const relationId = await this._songbookService.addSong(songbook.uid, this.song!.uid);
                            if (relationId) {
                                this.associatedSongbooks = this.associatedSongbooks.some((item) => item.uid === songbook.uid)
                                    ? this.associatedSongbooks
                                    : [...this.associatedSongbooks, songbook];
                                this._changeDetectorRef.markForCheck();
                                this.loadAssociatedSongbooks();
                            }
                        },
                        () => {
                            this._changeDetectorRef.markForCheck();
                        }
                    );
                }
            });
    }

    editSong(): void {
        if (this.song?.uid) {
            this._router.navigate(['/songs/create', this.song.uid]);
        }
    }

    removeSongbookAssociation(songbook: Songbook): void {
        const suggestionId = this._songbookSuggestionIds.get(songbook.uid);
        if (!suggestionId) {
            this.removeSongFromSongbook(songbook);
            return;
        }

        this._songbookSuggestionService
            .cancel({ uid: suggestionId } as SongbookSuggestion)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((cancelled) => {
                if (cancelled) {
                    this._songbookSuggestionIds.delete(songbook.uid);
                    this._pendingSongbooks = this._pendingSongbooks.filter((pending) => pending.uid !== songbook.uid);
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    deleteSong(): void {
        if (!this.song?.uid) {
            return;
        }

        this._editorService.confirmAndDelete(this.song).subscribe((success) => {
            if (success) {
                this._router.navigate(['/library']);
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    removeSongFromSongbook(songbook: Songbook): void {
        if (!this.song?.uid || !songbook?.uid) {
            return;
        }

        this.confirmCustomizationIfNeeded(songbook, async () => {
            const removed = await this._songbookService.removeSong(songbook.uid, this.song.uid);
            if (removed) {
                this.loadAssociatedSongbooks();
            }
        });
    }

    private requiresCustomizationConfirmation(songbook: Songbook): boolean {
        return Boolean(songbook.copiedFrom) && songbook.syncStatus !== 'customized';
    }

    private confirmCustomizationIfNeeded(songbook: Songbook, action: () => void, onCancel?: () => void): void {
        if (!this.requiresCustomizationConfirmation(songbook)) {
            action();
            return;
        }

        this._confirmationService
            .open({
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
                } else {
                    onCancel?.();
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
                this._pendingSongbooks = this._pendingSongbooks.filter((pending) =>
                    !songbooks.some((associated) => associated.uid === pending.uid)
                );
                this.refreshSongbookSearch();
                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
