import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subject, combineLatest, forkJoin, of, takeUntil } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SongSuggestionService } from 'app/core/firebase/api/song-suggestion.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongbookSuggestionService } from 'app/core/firebase/api/songbook-suggestion.service';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { UserService } from 'app/core/user/user.service';
import { Song } from 'app/models/song';
import { SongSuggestion } from 'app/models/song-suggestion';
import { Songbook } from 'app/models/songbook';
import { SongbookSuggestion } from 'app/models/songbook-suggestion';
import { computeLineDiff, DiffRow } from './line-diff';

type SongEditRow = {
    kind: 'song_edit';
    suggestion: SongSuggestion;
    songTitle: string;
    responseMessage: string;
    diffRows: DiffRow[];
    authorName: string;
};
type SongbookRow = { kind: 'songbook'; suggestion: SongbookSuggestion; songbookName: string; songTitle: string; responseMessage: string; authorName: string };
type SuggestionRow = SongEditRow | SongbookRow;
type MySongEditRow = { kind: 'song_edit'; suggestion: SongSuggestion; songTitle: string; diffRows: DiffRow[]; authorName: string };
type MySongbookRow = { kind: 'songbook'; suggestion: SongbookSuggestion; songbookName: string; songTitle: string; authorName: string };
type MyRow = MySongEditRow | MySongbookRow;
type HistoryRow =
    | { kind: 'song_edit'; suggestion: SongSuggestion; songTitle: string; authorName: string }
    | { kind: 'songbook'; suggestion: SongbookSuggestion; songbookName: string; songTitle: string; authorName: string };

@Component({
    selector: 'admin-suggestions-list',
    standalone: true,
    templateUrl: './list.html',
    imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatTooltipModule, RouterLink, TranslocoModule],
})
export default class SuggestionsList implements OnInit, OnDestroy {
    private _unsubscribeAll = new Subject<void>();

    isAuthenticated = signal(false);
    isAdmin = signal(false);
    rows = signal<SuggestionRow[]>([]);
    myRows = signal<MyRow[]>([]);
    busyIds = signal<Set<string>>(new Set());
    expandedDiffIds = signal<Set<string>>(new Set());
    showHistory = signal(false);
    historyLoaded = signal(false);
    historyRows = signal<HistoryRow[]>([]);
    historyVisibleCount = signal(20);


    constructor(
        private _userService: UserService,
        private _songSuggestionService: SongSuggestionService,
        private _songbookSuggestionService: SongbookSuggestionService,
        private _songService: SongService,
        private _songbookService: SongbookService,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _translocoService: TranslocoService
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

    trackByFn(index: number, row: SuggestionRow | MyRow | HistoryRow): string {
        return row.suggestion.uid || index.toString();
    }

    // Firestore Timestamps expose toDate(); fall back to null for pending serverTimestamp() writes.
    toDate(value: unknown): Date | null {
        return (value as { toDate?: () => Date })?.toDate?.() ?? null;
    }

    isAutomaticMessage(message: string | undefined): boolean {
        return message === 'Solicitud para incluir esta canción en el cancionero.';
    }

    toggleDiff(id: string): void {
        this.expandedDiffIds.update((ids) => {
            const next = new Set(ids);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    }

    targetRoute(row: SuggestionRow | MyRow | HistoryRow): string[] | null {
        if (row.kind === 'song_edit') {
            return ['/songs/read', row.suggestion.targetSongId];
        }

        return row.suggestion.targetSongbookId ? ['/songbook', row.suggestion.targetSongbookId] : null;
    }

    diffStats(diffRows: DiffRow[]): { added: number; removed: number } {
        return diffRows.reduce(
            (stats, row) => ({
                added: stats.added + (row.type === 'added' || row.type === 'changed' ? 1 : 0),
                removed: stats.removed + (row.type === 'removed' || row.type === 'changed' ? 1 : 0),
            }),
            { added: 0, removed: 0 }
        );
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

    createCopyAndAddSong(row: MySongbookRow): void {
        this.withBusy(row.suggestion.uid, () =>
            this._songbookSuggestionService.forkAndAddSuggestedSong(row.suggestion).subscribe((songbookId) => {
                if (songbookId) {
                    this._router.navigate(['/songbook', songbookId]);
                } else {
                    this._translocoService.selectTranslate('admin_suggestions.copy_creation_failed').pipe(takeUntil(this._unsubscribeAll)).subscribe((message) => {
                        this._snackBar.open(message, undefined, { duration: 5000 });
                    });
                }
                this.busyIds.update((ids) => {
                    const next = new Set(ids);
                    next.delete(row.suggestion.uid);
                    return next;
                });
            })
        );
    }

    private loadSuggestions(): void {
        combineLatest([this._songSuggestionService.getAllOpen(), this._songbookSuggestionService.getAllOpen()])
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(([songSuggestions, songbookSuggestions]) =>
                    this.resolveNames(songSuggestions, songbookSuggestions).pipe(
                        catchError(() => of({ songs: [], songbooks: [] })),
                        map(({ songs, songbooks }) => [
                            ...songSuggestions.map((suggestion): SongEditRow => {
                                const originalSong = songs.find((song) => song.uid === suggestion.targetSongId);
                                const originalContent = originalSong?.content || originalSong?.lyrics || '';
                                return {
                                    kind: 'song_edit',
                                    suggestion,
                                    songTitle: originalSong?.title || suggestion.targetSongId,
                                    responseMessage: '',
                                    diffRows: computeLineDiff(originalContent, suggestion.proposedSong.content ?? originalContent),
                                    authorName: suggestion.authorName || suggestion.authorId,
                                };
                            }),
                            ...songbookSuggestions.map((suggestion): SongbookRow => ({
                                kind: 'songbook',
                                suggestion,
                                songbookName:
                                    songbooks.find((songbook) => songbook.uid === suggestion.targetSongbookId)?.name ||
                                    suggestion.suggestedName ||
                                    suggestion.targetSongbookId ||
                                    '-',
                                songTitle:
                                    songs.find((song) => song.uid === suggestion.targetSongId)?.title ||
                                    suggestion.targetSongId ||
                                    '-',
                                responseMessage: '',
                                authorName: suggestion.authorName || suggestion.authorId,
                            })),
                        ])
                    )
                )
            )
            .subscribe({
                next: (rows) => this.rows.set(rows),
                error: () => this.rows.set([]),
            });
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
                                    (suggestion): MySongEditRow => {
                                        const originalSong = songs.find((song) => song.uid === suggestion.targetSongId);
                                        const originalContent = originalSong?.content || originalSong?.lyrics || '';
                                        const proposedContent = suggestion.proposedSong.content ?? originalContent;
                                        return {
                                            kind: 'song_edit',
                                            suggestion,
                                            songTitle: originalSong?.title || suggestion.targetSongId,
                                            diffRows: computeLineDiff(originalContent, proposedContent),
                                                authorName: suggestion.authorName || suggestion.authorId,
                                        };
                                    }
                                ),
                                ...songbookSuggestions.map(
                                    (suggestion): MySongbookRow => ({
                                        kind: 'songbook',
                                        suggestion,
                                        songbookName:
                                            songbooks.find((songbook) => songbook.uid === suggestion.targetSongbookId)?.name ||
                                            suggestion.suggestedName ||
                                            '-',
                                        songTitle:
                                            songs.find((song) => song.uid === suggestion.targetSongId)?.title ||
                                            suggestion.targetSongId ||
                                            '-',
                                            authorName: suggestion.authorName || suggestion.authorId,
                                    })
                                ),
                            ])
                        )
                    )
                )
            )
            .subscribe((rows) => this.myRows.set(rows));
    }

    toggleHistory(): void {
        this.showHistory.update((visible) => !visible);
        if (this.showHistory() && !this.historyLoaded()) {
            this.loadHistory();
        }
    }

    showMoreHistory(): void {
        this.historyVisibleCount.update((count) => count + 20);
    }

    private loadHistory(): void {
        this.historyLoaded.set(true);
        combineLatest([this._songSuggestionService.getHistory(), this._songbookSuggestionService.getHistory()])
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(([songSuggestions, songbookSuggestions]) =>
                    this.resolveNames(songSuggestions, songbookSuggestions).pipe(
                        map(({ songs, songbooks }) => [
                            ...songSuggestions.map(
                                (suggestion): HistoryRow => ({
                                    kind: 'song_edit',
                                    suggestion,
                                    songTitle: songs.find((song) => song.uid === suggestion.targetSongId)?.title || suggestion.targetSongId,
                                        authorName: suggestion.authorName || suggestion.authorId,
                                })
                            ),
                            ...songbookSuggestions.map(
                                (suggestion): HistoryRow => ({
                                    kind: 'songbook',
                                    suggestion,
                                    songbookName:
                                        songbooks.find((songbook) => songbook.uid === suggestion.targetSongbookId)?.name ||
                                        suggestion.suggestedName ||
                                        '-',
                                    songTitle:
                                        songs.find((song) => song.uid === suggestion.targetSongId)?.title ||
                                        suggestion.targetSongId ||
                                        '-',
                                        authorName: suggestion.authorName || suggestion.authorId,
                                })
                            ),
                        ])
                    )
                )
            )
            .subscribe((rows) => this.historyRows.set(rows));
    }

    private resolveNames(songSuggestions: SongSuggestion[], songbookSuggestions: SongbookSuggestion[]) {
        const songIds = [
            ...new Set([
                ...songSuggestions.map((suggestion) => suggestion.targetSongId),
                ...songbookSuggestions.map((suggestion) => suggestion.targetSongId),
            ].filter(Boolean)),
        ];
        const songbookIds = songbookSuggestions.map((suggestion) => suggestion.targetSongbookId).filter(Boolean);

        return forkJoin({
            // Fetch each song individually: SongService.getAll()'s 'in' query has been observed
            // to return stale/incomplete documents (missing `content`) for some songs.
            songs: songIds.length
                ? forkJoin(songIds.map((id) => this._songService.get(id).pipe(catchError(() => of(null))))).pipe(
                      map((songs) => songs.filter((song): song is Song => song !== null))
                  )
                : of([]),
            songbooks: songbookIds.length
                ? forkJoin(songbookIds.map((id) => this._songbookService.get(id).pipe(catchError(() => of(null))))).pipe(
                      map((songbooks) => songbooks.filter((songbook): songbook is Songbook => songbook !== null))
                  )
                : of([]),
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
