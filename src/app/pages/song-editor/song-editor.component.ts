import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewContainerRef,
    signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, firstValueFrom, forkJoin, from, map, switchMap, take, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongSuggestionService } from 'app/core/firebase/api/song-suggestion.service';
import { UserService } from 'app/core/user/user.service';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import {
    SongSuggestionDialogComponent,
    SongSuggestionDialogResult,
    SongSuggestionMode,
} from './song-suggestion-dialog.component';

@Component({
    selector: 'song-editor',
    standalone: true,
    templateUrl: './song-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, ChpSplitLayoutComponent, ChpSongPreviewComponent, ChpEditorComponent],
})
export class SongEditorComponent implements OnInit, OnDestroy {
    song: Song = new Song();
    hasPendingSuggestion = signal(false);
    alternateVersions = signal<PartialSong[]>([]);
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _savedContent = '';
    private _allowDeactivate = false;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _viewContainerRef: ViewContainerRef,
        private _songService: SongService,
        private _songSuggestionService: SongSuggestionService,
        private _userService: UserService,
        private _editorService: EditorService,
        private _confirmationService: FuseConfirmationService,
        private _matDialog: MatDialog,
        private _snackBar: MatSnackBar,
        private _translocoService: TranslocoService,
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this._handleKeyboardEvent = this._handleKeyboardEvent.bind(this);
    }

    private _handleKeyboardEvent(event: KeyboardEvent): void {
        if (event.key.toLowerCase() !== 's' || (!event.ctrlKey && !event.metaKey)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.saveSong();
    }

    ngOnInit(): void {
        // Siempre limpiar las referencias
        this.cleanupTemplateRefs();
        this.loadSong();
        // Capture phase: the third-party chordpro editor stops propagation of its own
        // keydown handling, so a bubbling document listener never sees Cmd/Ctrl+S.
        document.addEventListener('keydown', this._handleKeyboardEvent, true);
    }

    private loadSong(): void {
        this._route.paramMap
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((params) => {
                    const uid = params.get('uid');
                    if (uid) {
                        return this._songService.get(uid);
                    }
                    return [];
                })
            )
            .subscribe((data) => {
                if (data) {
                    this.song = data;
                    this._savedContent = this.song.content ?? '';
                    this.hasPendingSuggestion.set(false);
                    this.alternateVersions.set([]);
                    if (data.uid) {
                        const canonicalId = data.variantOf || data.uid;
                        forkJoin({
                            canonical: this._songService.get(canonicalId),
                            variants: this._songService.getVariants(canonicalId),
                        })
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe(({ canonical, variants }) => {
                                this.alternateVersions.set(
                                    [canonical, ...variants].sort((first, second) => {
                                        const firstIsCanonical = first.uid === canonicalId;
                                        const secondIsCanonical = second.uid === canonicalId;
                                        return Number(secondIsCanonical) - Number(firstIsCanonical);
                                    })
                                );
                                this._changeDetectorRef.markForCheck();
                            });
                        this._songSuggestionService
                            .getMineOpenForSong(data.uid)
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((suggestion) => {
                                this.hasPendingSuggestion.set(!!suggestion);
                                if (suggestion) {
                                    // Resume editing from your own pending proposal instead of the still-unapproved official content.
                                    this.song = { ...this.song, ...suggestion.proposedSong };
                                    this._savedContent = this.song.content ?? '';
                                }
                                this._changeDetectorRef.markForCheck();
                            });
                    }
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    // Evita el error de editor no visible si viene desde el editor de la librería
    private cleanupTemplateRefs(): void {
        const editors = document.querySelectorAll('chp-editor');

        if (editors.length > 0) {
            this._viewContainerRef.clear();

            editors.forEach((editor) => {
                const parent = editor.parentElement;
                if (parent) parent.removeChild(editor);
            });

            setTimeout(() => {
                this._changeDetectorRef.detectChanges();
            }, 50);
        }
    }

    saveSong(): void {
        const updatedSong = this._editorService.prepareSongFromContent(this.song.content);
        this.song = {
            ...this.song,
            ...Object.fromEntries(Object.entries(updatedSong).filter(([, value]) => value !== undefined)),
        };

        this.saveOrSuggest();
    }

    private async saveOrSuggest(): Promise<void> {
        if (await this.requiresSuggestion()) {
            // Already have a pending suggestion for this song: update it silently instead of asking again.
            if (this.hasPendingSuggestion()) {
                this.submitSuggestion(undefined, 'song_suggestion.updated');
            } else {
                this.openSuggestionDialog();
            }
            return;
        }

        this._songService.save(this.song).then((res) => {
            this.song.uid = res;
            this._savedContent = this.song.content ?? '';
        });
    }

    private async requiresSuggestion(): Promise<boolean> {
        if (!this.song.uid || !this.song.authorId) {
            return false;
        }

        const [user, isAdmin] = await Promise.all([
            firstValueFrom(this._userService.user$),
            firstValueFrom(this._userService.isAdmin()),
        ]);

        return !isAdmin && this.song.authorId !== user?.uid;
    }

    private openSuggestionDialog(): void {
        this._matDialog
            .open(SongSuggestionDialogComponent)
            .afterClosed()
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((result: SongSuggestionDialogResult | undefined) => {
                    if (!result) {
                        return from([{ id: null, messageKey: 'song_suggestion.sent', pending: true }]);
                    }

                    return this.createSuggestion(result.message, result.mode).pipe(
                        map((id) => ({ id, messageKey: 'song_suggestion.sent', pending: true }))
                    );
                })
            )
            .subscribe(({ id, messageKey, pending }) => {
                if (id && !pending) {
                    this.song.uid = id;
                    this.hasPendingSuggestion.set(false);
                }
                this.onSuggestionSaved(id, messageKey, pending);
            });
    }

    private submitSuggestion(message: string | undefined, sentMessageKey: string): void {
        this.createSuggestion(message)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((suggestionId) => this.onSuggestionSaved(suggestionId, sentMessageKey));
    }

    private createSuggestion(message?: string, mode: SongSuggestionMode = 'suggestion') {
        return this._songSuggestionService.create({
            targetSongId: this.song.uid,
            proposedOutcome: mode === 'version' ? 'version' : 'official',
            message,
            proposedSong: {
                title: this.song.title,
                subtitle: this.song.subtitle,
                content: this.song.content,
                lyrics: this.song.lyrics,
                albums: this.song.albums,
                arrangers: this.song.arrangers,
                artists: this.song.artists,
                composers: this.song.composers,
                lyricists: this.song.lyricists,
                copyright: this.song.copyright,
                songKey: this.song.songKey,
                uniqueChords: this.song.uniqueChords,
                defaultKeyUniqueChords: this.song.defaultKeyUniqueChords,
                capo: this.song.capo,
                tempo: this.song.tempo,
                time: this.song.time,
                duration: this.song.duration,
                year: this.song.year,
            },
        });
    }

    private onSuggestionSaved(suggestionId: string | null, sentMessageKey: string, pending = true): void {
        if (!suggestionId) {
            this._translocoService
                .selectTranslate('song_suggestion.save_failed')
                .pipe(take(1))
                .subscribe((message) => {
                    this._snackBar.open(message, undefined, { duration: 5000, panelClass: ['warning'] });
                });
            return;
        }

        this._savedContent = this.song.content ?? '';
        this.hasPendingSuggestion.set(pending);
        this._changeDetectorRef.markForCheck();
        this._translocoService
            .selectTranslate(sentMessageKey)
            .pipe(take(1))
            .subscribe((message) => {
                this._snackBar.open(message, undefined, { duration: 4000 });
            });
    }

    canDeactivate(): boolean | Observable<boolean> {
        if (this._allowDeactivate || (this.song.content ?? '') === this._savedContent) {
            return true;
        }

        return this._confirmationService
            .open({
                title: 'editor.unsaved_changes_title',
                message: 'editor.unsaved_changes_message',
                actions: {
                    confirm: {
                        label: 'editor.unsaved_changes_discard',
                    },
                },
            })
            .afterClosed()
            .pipe(map((result) => result === 'confirmed'));
    }

    removeSong(): void {
        this._editorService.confirmAndDelete(this.song).subscribe((success) => {
            if (success) {
                this._allowDeactivate = true;
                this._router.navigate(['/library']);
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    showHelp(): void {
        // Implement help functionality
    }

    onEditorClose() {
        if (this.song?.uid) {
            this._router.navigate(['/songs/read', this.song.uid]);
        }
    }

    ngOnDestroy(): void {
        document.removeEventListener('keydown', this._handleKeyboardEvent, true);
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
