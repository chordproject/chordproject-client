import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewContainerRef,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, firstValueFrom, map, switchMap, take, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongSuggestionService } from 'app/core/firebase/api/song-suggestion.service';
import { UserService } from 'app/core/user/user.service';
import { Song } from 'app/models/song';
import { SongSuggestionDialogComponent } from './song-suggestion-dialog.component';

@Component({
    selector: 'song-editor',
    standalone: true,
    templateUrl: './song-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, ChpSplitLayoutComponent, ChpSongPreviewComponent, ChpEditorComponent],
})
export class SongEditorComponent implements OnInit, OnDestroy {
    song: Song = new Song();
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
    ) {}

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent): void {
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
            this.openSuggestionDialog();
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
                switchMap((result) => {
                    if (!result) {
                        return [null];
                    }

                    return this._songSuggestionService.create({
                        targetSongId: this.song.uid,
                        message: result.message,
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
                })
            )
            .subscribe((suggestionId) => {
                if (suggestionId) {
                    this._savedContent = this.song.content ?? '';
                    this._translocoService
                        .selectTranslate('song_suggestion.sent')
                        .pipe(take(1))
                        .subscribe((message) => {
                            this._snackBar.open(message, undefined, { duration: 4000 });
                        });
                }
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
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
