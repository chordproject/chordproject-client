import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch,
} from 'firebase/firestore';
import { BehaviorSubject, Observable, Subject, combineLatest, defer, firstValueFrom, from, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';
import { DEFAULT_SONG_SORT, PartialSong, SongSort, SongSortField } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { normalizeText } from 'app/models/song-index';
import { Tag } from 'app/models/tag';
import { environment } from 'environments/environment';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../firebase.service';
import { SongIndexService } from './song-index.service';

@Injectable({
    providedIn: 'root',
})
export class SongService {
    private _firestore: Firestore;
    private _auth: Auth;
    private _snackBar: MatSnackBar;
    private _translocoService: TranslocoService;
    private _userService: UserService;
    private _authService: AuthService;
    private _songIndex: SongIndexService;
    private _songsCache$: Observable<PartialSong[]>;
    private _fullSongsCache$: Observable<PartialSong[]>;
    private _song = new BehaviorSubject<Song | null>(null);
    private _songsChanged = new Subject<void>();

    get song$(): Observable<Song> {
        return this._song.asObservable();
    }

    get songsChanged$(): Observable<void> {
        return this._songsChanged.asObservable();
    }

    constructor() {
        const firebase = inject(FirebaseService);
        this._firestore = firebase.firestore;
        this._auth = firebase.auth;
        this._snackBar = inject(MatSnackBar);
        this._translocoService = inject(TranslocoService);
        this._userService = inject(UserService);
        this._authService = inject(AuthService);
        this._songIndex = inject(SongIndexService);
    }

    get(id: string): Observable<Song> {
        return from(getDoc(doc(this._firestore, 'songs', id))).pipe(
            map((docSnap) => {
                if (docSnap.exists()) {
                    const song = docSnap.data() as Song;
                    this._song.next(song);
                    return song;
                } else {
                    throw new Error(`Song with ID ${id} not found`);
                }
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getAll(ids: string[]): Observable<PartialSong[]> {
        if (!ids || ids.length === 0) {
            return of([]);
        }

        return this._songIndex.getEntries().pipe(
            switchMap((entries) => {
                const indexed = new Map((entries ?? []).map((entry) => [entry.uid, entry]));
                const found = ids.filter((id) => indexed.has(id)).map((id) => indexed.get(id));
                const missing = ids.filter((id) => !indexed.has(id));

                if (!missing.length) {
                    return of(found);
                }

                return this.readSongsByIds(missing).pipe(map((rest) => [...found, ...rest]));
            }),
            catchError((error) => this.handleError(error))
        );
    }

    private readSongsByIds(ids: string[]): Observable<PartialSong[]> {
        const chunkSize = 30;
        const idChunks = Array.from({ length: Math.ceil(ids.length / chunkSize) }, (_, i) =>
            ids.slice(i * chunkSize, (i + 1) * chunkSize)
        );

        const observables = idChunks.map((chunk) =>
            from(getDocs(query(collection(this._firestore, 'songs'), where('uid', 'in', chunk)))).pipe(
                map((snapshot) => snapshot.docs.map((songDoc) => songDoc.data() as PartialSong))
            )
        );

        return combineLatest(observables).pipe(map((results) => results.flat()));
    }

    searchByTitle(searchTerm?: string, limitResults?: number, sort?: SongSort): Observable<PartialSong[]> {
        return this.getCachedSongs().pipe(
            map((allSongs) => {
                const normalizedTerm = normalizeText(searchTerm).trim();
                const songs = allSongs.filter((song) =>
                    normalizedTerm ? normalizeText(song.title).includes(normalizedTerm) : true
                );

                return this.sortSongs(songs, sort).slice(0, limitResults ?? songs.length);
            })
        );
    }

    /** Exact (normalized) title matches, used to warn about likely duplicates before creating a new song. */
    findByExactTitle(title: string, excludeUid?: string): Observable<PartialSong[]> {
        const normalizedTitle = normalizeText(title).trim();
        if (!normalizedTitle) {
            return of([]);
        }

        return this.getCachedSongs().pipe(
            map((allSongs) =>
                allSongs.filter(
                    (song) => song.uid !== excludeUid && !song.variantOf && normalizeText(song.title).trim() === normalizedTitle
                )
            )
        );
    }

    searchByTitleContains(searchTerm: string, limitResults = 20): Observable<PartialSong[]> {
        return this.getCachedSongs().pipe(
            map((allSongs) => {
                const normalizedTerm = normalizeText(searchTerm).trim();
                if (!normalizedTerm) {
                    return [];
                }

                const songs = allSongs.filter((song) => normalizeText(song.title).includes(normalizedTerm));

                return this.sortSongs(songs).slice(0, limitResults);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    searchByArtist(searchTerm?: string, limitResults?: number): Observable<PartialSong[]> {
        return this.getCachedSongs().pipe(
            map((allSongs) => {
                const normalizedTerm = normalizeText(searchTerm).trim();
                if (!normalizedTerm) {
                    return [];
                }

                const songs = allSongs.filter((song) =>
                    (song.artists || []).some((artist) => normalizeText(artist).includes(normalizedTerm))
                );

                return this.sortSongs(songs, { field: 'artists', direction: 'asc' }).slice(0, limitResults ?? songs.length);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    searchByLyrics(searchTerm?: string, limitResults?: number): Observable<PartialSong[]> {
        const normalizedTerm = normalizeText(searchTerm).trim();

        if (!normalizedTerm) {
            return this.searchByTitle(undefined, limitResults);
        }

        return combineLatest([this.getCachedSongs(), this._songIndex.getSearchText()]).pipe(
            switchMap(([songs, searchText]) => {
                if (searchText) {
                    return of(songs.filter((song) => (searchText.get(song.uid) || '').includes(normalizedTerm)));
                }

                // Sin indice de busqueda hay que mirar las letras completas de la coleccion.
                return this.getFullSongs().pipe(
                    map((allSongs) =>
                        allSongs.filter(
                            (song) => !song.variantOf && normalizeText(song.lyrics).includes(normalizedTerm)
                        )
                    )
                );
            }),
            map((songs) => this.sortSongs(songs).slice(0, limitResults ?? songs.length)),
            catchError((error) => this.handleError(error))
        );
    }

    getLatest(pageSize = 10): Observable<PartialSong[]> {
        return this._songIndex.getEntries().pipe(
            switchMap((entries) => {
                if (!entries) {
                    return this.readLatestFromCollection(pageSize);
                }

                const songs = entries.filter((song) => !song.variantOf);

                return of(
                    this.sortSongs(songs, { field: 'creationDate', direction: 'desc' }).slice(0, pageSize)
                );
            }),
            catchError((error) => this.handleError(error))
        );
    }

    private readLatestFromCollection(pageSize: number): Observable<PartialSong[]> {
        const q = query(collection(this._firestore, 'songs'), orderBy('creationDate', 'desc'), limit(pageSize));

        return from(getDocs(q)).pipe(
            map((snapshot) =>
                snapshot.docs.map((songDoc) => songDoc.data() as PartialSong).filter((song) => !song.variantOf)
            )
        );
    }

    getVariants(originalSongId: string): Observable<PartialSong[]> {
        const q = query(collection(this._firestore, 'songs'), where('variantOf', '==', originalSongId));

        return from(getDocs(q)).pipe(
            map((snapshot) => snapshot.docs.map((document) => ({ uid: document.id, ...document.data() }) as PartialSong)),
            catchError((error) => this.handleError(error))
        );
    }

    async save(song: Song): Promise<string> {
        if (!(await this.verifyAuthentication())) {
            return null;
        }

        if (!song.title) {
            this.showSnackbar('song_service.title_required', 3000, 'warning');
            return null;
        }

        try {
            const user = await firstValueFrom(this._userService.user$);
            const userUid = user?.uid;

            if (!song.uid) {
                song.uid = doc(collection(this._firestore, 'songs')).id;
                song.creationDate = serverTimestamp();
                song.source = environment.source;
                song.videoId = '';
                song.authorId = userUid;
            }

            const songData = Object.fromEntries(
                Object.entries(song).filter(([, value]) => value !== undefined)
            );
            const batch = writeBatch(this._firestore);
            batch.set(doc(this._firestore, 'songs', song.uid), songData);
            await this.stageIndex(() => this._songIndex.stageUpsert(batch, song));
            await batch.commit();
            this.invalidateCaches();
            this.showSnackbar('song_service.song_saved');
            return song.uid;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        if (!(await this.verifyAuthentication())) {
            return false;
        }

        try {
            const batch = writeBatch(this._firestore);
            batch.delete(doc(this._firestore, 'songs', id));
            await this.stageIndex(() => this._songIndex.stageRemove(batch, id));
            await batch.commit();
            this.invalidateCaches();
            this.showSnackbar('song_service.song_deleted');
            this._songsChanged.next();
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    private async verifyAuthentication(): Promise<boolean> {
        const isAuthenticated = await firstValueFrom(this._userService.isAuthenticated());
        if (!isAuthenticated) {
            this._authService.promptSignIn();
            return false;
        }
        return true;
    }

    private showSnackbar(messageKey: string, duration = 3000, type?: string): void {
        this._translocoService
            .selectTranslate(messageKey)
            .pipe(switchMap((message) => this._translocoService.selectTranslate('common.close').pipe(map((closeLabel) => ({ message, closeLabel })))), take(1))
            .subscribe(({ message, closeLabel }) => {
                this._snackBar.open(message, closeLabel, {
                    duration,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    panelClass: type ? [type] : [],
                });
            });
    }

    private handleError(error: any): Observable<never> {
        console.error('Firebase service error:', error);
        let errorMessage = 'An unexpected error occurred';

        if (error.message) {
            errorMessage = error.message;
        }

        this.showSnackbar('common.unexpected_error', 3000, 'error');
        return throwError(() => new Error(errorMessage));
    }

    getTags() {
        return from(getDocs(query(collection(this._firestore, 'tags'), orderBy('title')))).pipe(
            map((snapshot) => snapshot.docs.map((tagDoc) => ({ id: tagDoc.id, ...tagDoc.data() }) as Tag)),
            catchError(() => of([] as Tag[]))
        );
    }

    private getCachedSongs(): Observable<PartialSong[]> {
        if (!this._songsCache$) {
            this._songsCache$ = defer(() =>
                this._songIndex
                    .getEntries()
                    .pipe(switchMap((entries) => (entries ? of(entries) : this.getFullSongs())))
            ).pipe(
                map((songs) => songs.filter((song) => !song.variantOf)),
                catchError((error) => this.handleError(error)),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }

        return this._songsCache$;
    }

    /** Lectura completa de `songs`. Solo se usa mientras el indice no exista. */
    private getFullSongs(): Observable<PartialSong[]> {
        if (!this._fullSongsCache$) {
            this._fullSongsCache$ = defer(() =>
                from(getDocs(query(collection(this._firestore, 'songs'), orderBy('title'))))
            ).pipe(
                map((snapshot) =>
                    snapshot.docs.map((document) => ({ uid: document.id, ...document.data() }) as PartialSong)
                ),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }

        return this._fullSongsCache$;
    }

    private invalidateCaches(): void {
        this._songsCache$ = null;
        this._fullSongsCache$ = null;
        this._songIndex.invalidate();
    }

    /** El indice es derivado: si no se puede preparar, la cancion se guarda igual y se repara reindexando. */
    private async stageIndex(stage: () => Promise<void>): Promise<void> {
        try {
            await stage();
        } catch (error) {
            console.warn('No se pudo actualizar el indice de canciones, ejecutar el reindexado.', error);
        }
    }

    private compareByTitle(first: PartialSong, second: PartialSong): number {
        return this.getTitleSortKey(first.title).localeCompare(this.getTitleSortKey(second.title), 'es', {
            sensitivity: 'base',
        });
    }

    private getTitleSortKey(title: string | undefined): string {
        return normalizeText(title || '').replace(/^[^a-z0-9]+/, '');
    }

    /** Firestore Timestamp, Date o el objeto plano `{ seconds }` que llega desde el backup/SSR. */
    private toMillis(value: unknown): number {
        if (value instanceof Date) {
            return value.getTime();
        }
        if (value && typeof value === 'object' && typeof (value as { seconds?: unknown }).seconds === 'number') {
            return (value as { seconds: number }).seconds * 1000;
        }
        return 0;
    }

    private compareByField(first: PartialSong, second: PartialSong, field: SongSortField): number {
        if (field === 'creationDate') {
            return this.toMillis(first.creationDate) - this.toMillis(second.creationDate);
        }
        if (field === 'artists') {
            return (first.artists?.[0] || '').localeCompare(second.artists?.[0] || '', 'es', {
                sensitivity: 'base',
            });
        }
        return this.compareByTitle(first, second);
    }

    private sortSongs(songs: PartialSong[], sort: SongSort = DEFAULT_SONG_SORT): PartialSong[] {
        const factor = sort.direction === 'desc' ? -1 : 1;

        return [...songs].sort((first, second) => {
            const result = this.compareByField(first, second, sort.field);

            return result !== 0 ? factor * result : this.compareByTitle(first, second);
        });
    }

    createTag(title: string): Observable<Tag> {
        const cleanTitle = (title || '').trim();
        const slug = cleanTitle
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, ' ');

        if (!cleanTitle) {
            return throwError(() => new Error('Tag title is required'));
        }

        return from(
            (async () => {
                if (!(await this.verifyAuthentication())) {
                    throw new Error('Authentication required');
                }

                const tagRef = doc(collection(this._firestore, 'tags'));
                await setDoc(tagRef, {
                    title: cleanTitle,
                    slug,
                    authorId: this._auth.currentUser.uid,
                    creationDate: serverTimestamp(),
                    lastUpdateDate: serverTimestamp(),
                });

                return { id: tagRef.id, title: cleanTitle } as Tag;
            })()
        ).pipe(catchError((error) => this.handleError(error)));
    }

    updateSongTags(songId: string, tagIds: string[]): Promise<boolean> {
        return (async () => {
            if (!(await this.verifyAuthentication())) {
                return false;
            }

            try {
                await setDoc(
                    doc(this._firestore, 'songs', songId),
                    {
                        tags: [...new Set(tagIds)],
                        lastUpdateDate: serverTimestamp(),
                    },
                    { merge: true }
                );
                this.showSnackbar('song_service.song_tags_updated');
                return true;
            } catch (error) {
                this.handleError(error);
                return false;
            }
        })();
    }
}
