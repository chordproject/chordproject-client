import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
    signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, combineLatest, firstValueFrom, from, map, switchMap, take, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongSuggestionService } from 'app/core/firebase/api/song-suggestion.service';
import { UserService } from 'app/core/user/user.service';
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
    imports: [MatCardModule, ChpSplitLayoutComponent, ChpSongPreviewComponent, ChpEditorComponent, TranslocoModule],
})
export class SongEditorComponent implements OnInit, OnDestroy {
    @ViewChild(ChpSplitLayoutComponent) splitLayout: ChpSplitLayoutComponent;
    @ViewChild('songPreview') songPreview: ChpSongPreviewComponent;

    song = signal<Song>(new Song());
    hasPendingSuggestion = signal(false);
    isAuthenticated = signal(false);
    canDelete = signal(false);
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
        this._userService
            .isAuthenticated()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((isAuthenticated) => {
                this.isAuthenticated.set(isAuthenticated);
                this.updateCanDelete();
                this._changeDetectorRef.markForCheck();
            });
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
                    const loadedSong = new Song();
                    Object.assign(loadedSong, data);
                    this.song.set(loadedSong);
                    this.updateCanDelete();
                    this._savedContent = loadedSong.content ?? '';
                    this.hasPendingSuggestion.set(false);
                    if (data.uid) {
                        this._songSuggestionService
                            .getMineOpenForSong(data.uid)
                            .pipe(takeUntil(this._unsubscribeAll))
                            .subscribe((suggestion) => {
                                this.hasPendingSuggestion.set(!!suggestion);
                                if (suggestion) {
                                    // Resume editing from your own pending proposal instead of the still-unapproved official content.
                                    const merged = new Song();
                                    Object.assign(merged, this.song(), suggestion.proposedSong);
                                    this.song.set(merged);
                                    this._savedContent = merged.content ?? '';
                                }
                            });
                    }
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

    onContentChange(content: string): void {
        const current = this.song();
        if (current.content === content) {
            return;
        }

        const updatedFields = this._editorService.prepareSongFromContent(content);
        const updatedSong = new Song();
        Object.assign(updatedSong, current, updatedFields, { content });
        this.song.set(updatedSong);
    }

    saveSong(): void {
        if (!this.isAuthenticated()) {
            this._translocoService
                .selectTranslate('editor.login_to_save')
                .pipe(take(1))
                .subscribe((message) => this._snackBar.open(message, undefined, { duration: 5000, panelClass: ['warning'] }));
            return;
        }

        const current = this.song();
        const updatedFields = this._editorService.prepareSongFromContent(current.content);
        const updatedSong = new Song();
        Object.assign(updatedSong, current, updatedFields);
        this.song.set(updatedSong);

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

        const res = await this._songService.save(this.song());
        if (res) {
            const current = this.song();
            const updated = new Song();
            Object.assign(updated, current, { uid: res });
            this.song.set(updated);
            this._savedContent = updated.content ?? '';

            if (!this._route.snapshot.paramMap.get('uid')) {
                this._router.navigate(['/songs/create', res], { replaceUrl: true });
            }
        }
    }

    private async requiresSuggestion(): Promise<boolean> {
        const current = this.song();
        if (!current.uid || !current.authorId) {
            return false;
        }

        const [user, isAdmin] = await Promise.all([
            firstValueFrom(this._userService.user$),
            firstValueFrom(this._userService.isAdmin()),
        ]);

        return !isAdmin && current.authorId !== user?.uid;
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
                    const current = this.song();
                    const updated = new Song();
                    Object.assign(updated, current, { uid: id });
                    this.song.set(updated);
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
        const current = this.song();
        return this._songSuggestionService.create({
            targetSongId: current.uid,
            proposedOutcome: mode === 'version' ? 'version' : 'official',
            message,
            proposedSong: {
                title: current.title,
                subtitle: current.subtitle,
                content: current.content,
                lyrics: current.lyrics,
                albums: current.albums,
                arrangers: current.arrangers,
                artists: current.artists,
                composers: current.composers,
                lyricists: current.lyricists,
                copyright: current.copyright,
                songKey: current.songKey,
                uniqueChords: current.uniqueChords,
                defaultKeyUniqueChords: current.defaultKeyUniqueChords,
                capo: current.capo,
                tempo: current.tempo,
                time: current.time,
                duration: current.duration,
                year: current.year,
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

        this._savedContent = this.song().content ?? '';
        this.hasPendingSuggestion.set(pending);
        this._translocoService
            .selectTranslate(sentMessageKey)
            .pipe(take(1))
            .subscribe((message) => {
                this._snackBar.open(message, undefined, { duration: 4000 });
            });
    }

    canDeactivate(): boolean | Observable<boolean> {
        if (this._allowDeactivate || (this.song().content ?? '') === this._savedContent) {
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

    private updateCanDelete(): void {
        const currentSong = this.song();
        if (!currentSong?.uid) {
            this.canDelete.set(false);
            return;
        }

        combineLatest([this._userService.user$, this._userService.isAdmin()])
            .pipe(take(1))
            .subscribe(([user, isAdmin]) => {
                const isAuthor = Boolean(user?.uid && (currentSong.authorId === user.uid || currentSong.ownerId === user.uid));
                this.canDelete.set(Boolean(isAdmin || isAuthor));
                this._changeDetectorRef.markForCheck();
            });
    }

    removeSong(): void {
        if (!this.canDelete()) {
            return;
        }

        this._editorService.confirmAndDelete(this.song()).subscribe((success) => {
            if (success) {
                this._allowDeactivate = true;
                this._router.navigate(['/library']);
            }
        });
    }

    showHelp(): void {
        // Implement help functionality
    }

    onEditorClose() {
        const current = this.song();
        if (current?.uid) {
            this._router.navigate(['/songs/read', current.uid]);
        }
    }

    closePreview(): void {
        if (this.splitLayout?.isMobile) {
            this.splitLayout.togglePreview();
        }
    }

    openPreview(): void {
        if (this.splitLayout?.isMobile && this.splitLayout.showPrimaryArea) {
            this.splitLayout.togglePreview();
        }
    }

    transposeSong(direction: 'up' | 'down'): void {
        this.songPreview?.transpose(direction);
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
