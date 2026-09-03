import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, firstValueFrom, of, Subject, switchMap, takeUntil } from 'rxjs';
import { catchError, debounceTime, map, startWith, take } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
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

export type TagOption = Tag & { isNew?: boolean };

@Component({
    selector: 'song-reader',
    standalone: true,
    templateUrl: './song-reader.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatCardModule,
        MatIconModule,
        MatSidenavModule,
        RouterOutlet,
        ChpSongPreviewComponent,
        ReactiveFormsModule,
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
    isAuthenticated = false;
    songbookSearchControl: UntypedFormControl = new UntypedFormControl('');
    filteredSongbooks$: Observable<Songbook[]>;
    tagSearchControl: UntypedFormControl = new UntypedFormControl('');
    filteredTags$: Observable<TagOption[]>;
    private _allTags: Tag[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _songbookIdsBeingAdded = new Set<string>();
    private _songbookSuggestionIds = new Map<string, string>();
    private _pendingSongbooks: Songbook[] = [];

    get pendingSongbooksList(): Songbook[] {
        return this._pendingSongbooks;
    }

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
        private route: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _confirmationService: FuseConfirmationService,
        private _userService: UserService,
        private _translocoService: TranslocoService,
        private _snackBar: MatSnackBar,
        private _location: Location
    ) {}

    /** Reached from many places (search, home, library, songbooks...), so browser history is the only universal "back". */
    goBack(): void {
        this._location.back();
    }

    ngOnInit(): void {
        this.drawerMode = 'over';
        this.loadSong();
        this.setupSongbookSearch();
        this.setupTagSearch();

        this._userService
            .isAuthenticated()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((authenticated) => {
                this.isAuthenticated = authenticated;
                this._changeDetectorRef.markForCheck();
            });

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
                this._songService
                    .getTags()
                    .pipe(takeUntil(this._unsubscribeAll), catchError(() => of([])))
                    .subscribe((tags) => {
                        this._allTags = tags;
                        this.associatedTags = tags.filter((tag) => songTags.includes(tag.id));
                        this.refreshTagSearch();
                        this._changeDetectorRef.markForCheck();
                    });
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

    private setupTagSearch(): void {
        this.filteredTags$ = this.tagSearchControl.valueChanges.pipe(
            startWith(''),
            debounceTime(150),
            map((value: string | TagOption) => {
                const searchTerm = typeof value === 'string' ? value.trim() : value?.title ?? '';
                const normalizedSearch = this.normalize(searchTerm);

                const unassigned = this._allTags.filter(
                    (tag) => !this.associatedTags.some((associated) => associated.id === tag.id)
                );

                if (!normalizedSearch) {
                    return unassigned;
                }

                const matches: TagOption[] = unassigned.filter((tag) =>
                    this.normalize(tag.title).includes(normalizedSearch)
                );

                const exactMatch = this._allTags.some(
                    (tag) => this.normalize(tag.title) === normalizedSearch
                );

                if (!exactMatch && searchTerm.length >= 2) {
                    return [...matches, { id: '__new__', title: searchTerm, isNew: true }];
                }

                return matches;
            })
        );
    }

    private refreshTagSearch(): void {
        this.tagSearchControl.setValue(this.tagSearchControl.value, { emitEvent: true });
    }

    displayTag(value: TagOption | string | null): string {
        if (!value) {
            return '';
        }
        return typeof value === 'string' ? value : value.title || '';
    }

    async onTagSelected(option: TagOption): Promise<void> {
        if (!this.song?.uid || !option) {
            return;
        }

        this.tagSearchControl.setValue('', { emitEvent: false });

        if (!this.isAuthenticated) {
            this._translocoService
                .selectTranslate('common.authentication_required')
                .pipe(take(1))
                .subscribe((message) => {
                    this._snackBar.open(message, undefined, { duration: 5000, panelClass: ['warning'] });
                });
            this.refreshTagSearch();
            this._changeDetectorRef.markForCheck();
            return;
        }

        if (option.isNew) {
            this._songService
                .createTag(option.title)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(async (createdTag) => {
                    if (createdTag?.id) {
                        this._allTags = [...this._allTags, createdTag];
                        await this.addTagToCurrentSong(createdTag);
                    }
                });
        } else {
            await this.addTagToCurrentSong(option);
        }
    }

    private async addTagToCurrentSong(tag: Tag): Promise<void> {
        if (!this.song?.uid || !tag?.id) {
            return;
        }

        const currentTagIds = this.song.tags ?? [];
        if (currentTagIds.includes(tag.id)) {
            return;
        }

        const updatedTagIds = [...new Set([...currentTagIds, tag.id])];
        const success = await this._songService.updateSongTags(this.song.uid, updatedTagIds);

        if (success) {
            this.song.tags = updatedTagIds;
            if (!this.associatedTags.some((t) => t.id === tag.id)) {
                this.associatedTags = [...this.associatedTags, tag];
            }
            this.refreshTagSearch();
            this._changeDetectorRef.markForCheck();
        }
    }

    async removeTag(tag: Tag): Promise<void> {
        if (!this.song?.uid || !tag?.id) {
            return;
        }

        if (!this.isAuthenticated) {
            this._translocoService
                .selectTranslate('common.authentication_required')
                .pipe(take(1))
                .subscribe((message) => {
                    this._snackBar.open(message, undefined, { duration: 5000, panelClass: ['warning'] });
                });
            return;
        }

        const currentTagIds = this.song.tags ?? [];
        const updatedTagIds = currentTagIds.filter((id) => id !== tag.id);
        const success = await this._songService.updateSongTags(this.song.uid, updatedTagIds);

        if (success) {
            this.song.tags = updatedTagIds;
            this.associatedTags = this.associatedTags.filter((t) => t.id !== tag.id);
            this.refreshTagSearch();
            this._changeDetectorRef.markForCheck();
        }
    }

    private normalize(value: string): string {
        return (value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    addCurrentSongToSongbook(songbook: Songbook): void {
        if (!this.song?.uid || !songbook?.uid) {
            return;
        }

        this.songbookSearchControl.setValue('', { emitEvent: false });

        if (!this.isAuthenticated) {
            this._translocoService
                .selectTranslate('common.authentication_required')
                .pipe(take(1))
                .subscribe((message) => {
                    this._snackBar.open(message, undefined, { duration: 5000, panelClass: ['warning'] });
                });
            this.refreshSongbookSearch();
            this._changeDetectorRef.markForCheck();
            return;
        }

        this._songbookIdsBeingAdded.add(songbook.uid);
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
