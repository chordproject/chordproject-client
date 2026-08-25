import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, combineLatest, forkJoin, of, takeUntil } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { SongSuggestionService } from 'app/core/firebase/api/song-suggestion.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongbookSuggestionService } from 'app/core/firebase/api/songbook-suggestion.service';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { UserService } from 'app/core/user/user.service';
import { SongbookSuggestion } from 'app/models/songbook-suggestion';
import { SongSuggestion } from 'app/models/song-suggestion';

type SongEditRow = { kind: 'song_edit'; suggestion: SongSuggestion; songTitle: string; responseMessage: string };
type SongbookRow = { kind: 'songbook'; suggestion: SongbookSuggestion; songbookName: string; responseMessage: string };
type SuggestionRow = SongEditRow | SongbookRow;
type MySongEditRow = { kind: 'song_edit'; suggestion: SongSuggestion; songTitle: string };
type MySongbookRow = { kind: 'songbook'; suggestion: SongbookSuggestion; songbookName: string };
type MyRow = MySongEditRow | MySongbookRow;

@Component({
    selector: 'admin-suggestions-list',
    standalone: true,
    templateUrl: './list.html',
    imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, RouterLink, TranslocoModule],
})
export default class SuggestionsList implements OnInit, OnDestroy {
    private _unsubscribeAll = new Subject<void>();

    isAuthenticated = signal(false);
    isAdmin = signal(false);
    rows = signal<SuggestionRow[]>([]);
    myRows = signal<MyRow[]>([]);
    busyIds = signal<Set<string>>(new Set());

    constructor(
        private _userService: UserService,
        private _songSuggestionService: SongSuggestionService,
        private _songbookSuggestionService: SongbookSuggestionService,
        private _songService: SongService,
        private _songbookService: SongbookService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this._userService
            .isAuthenticated()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((isAuthenticated) => {
                this.isAuthenticated.set(isAuthenticated);
                if (isAuthenticated) {
                    this.loadMine();
                }
            });

        this._userService
            .isAdmin()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((isAdmin) => {
                this.isAdmin.set(isAdmin);
                if (isAdmin) {
                    this.loadSuggestions();
                }
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, row: SuggestionRow | MyRow): string {
        return row.suggestion.uid || index.toString();
    }

    // Firestore Timestamps expose toDate(); fall back to null for pending serverTimestamp() writes.
    toDate(value: unknown): Date | null {
        return (value as { toDate?: () => Date })?.toDate?.() ?? null;
    }

    targetRoute(row: SuggestionRow | MyRow): string[] | null {
        if (row.kind === 'song_edit') {
            return ['/songs/read', row.suggestion.targetSongId];
        }

        return row.suggestion.targetSongbookId ? ['/songbook', row.suggestion.targetSongbookId] : null;
    }

    approveSongEdit(row: SongEditRow): void {
        this.withBusy(row.suggestion.uid, () =>
            this._songSuggestionService.approve(row.suggestion, row.responseMessage).subscribe((success) => this.finishAction(row, success))
        );
    }

    rejectSongEdit(row: SongEditRow): void {
        this.withBusy(row.suggestion.uid, () =>
            this._songSuggestionService.reject(row.suggestion, row.responseMessage).subscribe((success) => this.finishAction(row, success))
        );
    }

    createVersion(row: SongEditRow): void {
        this.withBusy(row.suggestion.uid, () =>
            this._songSuggestionService.createVersion(row.suggestion, row.responseMessage).subscribe((newSongId) => this.finishAction(row, !!newSongId))
        );
    }

    approveSongbook(row: SongbookRow): void {
        this.withBusy(row.suggestion.uid, () =>
            this._songbookSuggestionService.approve(row.suggestion, row.responseMessage).subscribe((success) => this.finishAction(row, success))
        );
    }

    rejectSongbook(row: SongbookRow): void {
        this.withBusy(row.suggestion.uid, () =>
            this._songbookSuggestionService.reject(row.suggestion, row.responseMessage).subscribe((success) => this.finishAction(row, success))
        );
    }

    private loadSuggestions(): void {
        combineLatest([this._songSuggestionService.getAllOpen(), this._songbookSuggestionService.getAllOpen()])
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(([songSuggestions, songbookSuggestions]) =>
                    this.resolveNames(songSuggestions, songbookSuggestions).pipe(
                        switchMap(({ songs, songbooks }) =>
                            of([
                                ...songSuggestions.map(
                                    (suggestion): SongEditRow => ({
                                        kind: 'song_edit',
                                        suggestion,
                                        songTitle: songs.find((song) => song.uid === suggestion.targetSongId)?.title || suggestion.targetSongId,
                                        responseMessage: '',
                                    })
                                ),
                                ...songbookSuggestions.map(
                                    (suggestion): SongbookRow => ({
                                        kind: 'songbook',
                                        suggestion,
                                        songbookName:
                                            songbooks.find((songbook) => songbook.uid === suggestion.targetSongbookId)?.name ||
                                            suggestion.suggestedName ||
                                            '-',
                                        responseMessage: '',
                                    })
                                ),
                            ])
                        )
                    )
                )
            )
            .subscribe((rows) => this.rows.set(rows));
    }

    private loadMine(): void {
        combineLatest([this._songSuggestionService.getMine(), this._songbookSuggestionService.getMine()])
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(([songSuggestions, songbookSuggestions]) =>
                    this.resolveNames(songSuggestions, songbookSuggestions).pipe(
                        switchMap(({ songs, songbooks }) =>
                            of([
                                ...songSuggestions.map(
                                    (suggestion): MySongEditRow => ({
                                        kind: 'song_edit',
                                        suggestion,
                                        songTitle: songs.find((song) => song.uid === suggestion.targetSongId)?.title || suggestion.targetSongId,
                                    })
                                ),
                                ...songbookSuggestions.map(
                                    (suggestion): MySongbookRow => ({
                                        kind: 'songbook',
                                        suggestion,
                                        songbookName:
                                            songbooks.find((songbook) => songbook.uid === suggestion.targetSongbookId)?.name ||
                                            suggestion.suggestedName ||
                                            '-',
                                    })
                                ),
                            ])
                        )
                    )
                )
            )
            .subscribe((rows) => this.myRows.set(rows));
    }

    private resolveNames(songSuggestions: SongSuggestion[], songbookSuggestions: SongbookSuggestion[]) {
        const songIds = songSuggestions.map((suggestion) => suggestion.targetSongId).filter(Boolean);
        const songbookIds = songbookSuggestions.map((suggestion) => suggestion.targetSongbookId).filter(Boolean);

        return forkJoin({
            songs: songIds.length ? this._songService.getAll(songIds).pipe(catchError(() => of([]))) : of([]),
            songbooks: songbookIds.length ? this._songbookService.getAll().pipe(catchError(() => of([]))) : of([]),
        });
    }

    private withBusy(id: string, action: () => void): void {
        if (this.busyIds().has(id)) {
            return;
        }
        this.busyIds.update((ids) => new Set(ids).add(id));
        action();
    }

    private finishAction(row: SuggestionRow, success: boolean): void {
        this.busyIds.update((ids) => {
            const next = new Set(ids);
            next.delete(row.suggestion.uid);
            return next;
        });

        if (success) {
            this.rows.update((rows) => rows.filter((current) => current.suggestion.uid !== row.suggestion.uid));
        } else {
            this._snackBar.open('No se pudo procesar la sugerencia', 'Cerrar', { duration: 3000 });
        }
    }
}
