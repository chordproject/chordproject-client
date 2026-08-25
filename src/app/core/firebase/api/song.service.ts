import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { BehaviorSubject, Observable, Subject, combineLatest, defer, firstValueFrom, from, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';
import { DEFAULT_SONG_SORT, PartialSong, SongSort, SongSortField } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { Tag } from 'app/models/tag';
import { environment } from 'environments/environment';
import { FirebaseService } from '../firebase.service';

@Injectable({
    providedIn: 'root',
})
export class SongService {
    private _firestore: Firestore;
    private _auth: Auth;
    private _snackBar: MatSnackBar;
    private _translocoService: TranslocoService;
    private _userService: UserService;
    private _songsCache$: Observable<PartialSong[]>;
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
            return from([[]]);
        }

        const chunkSize = 30;
        const idChunks = Array.from({ length: Math.ceil(ids.length / chunkSize) }, (_, i) =>
            ids.slice(i * chunkSize, (i + 1) * chunkSize)
        );

        const observables = idChunks.map((chunk) => {
            return from(getDocs(query(collection(this._firestore, 'songs'), where('uid', 'in', chunk)))).pipe(
                map((snapshot) => snapshot.docs.map((doc) => doc.data() as PartialSong))
            );
        });

        return combineLatest(observables).pipe(
            map((results) => results.flat()),
            catchError((error) => this.handleError(error))
        );
    }

    searchByTitle(searchTerm?: string, limitResults?: number, sort?: SongSort): Observable<PartialSong[]> {
        return this.getCachedSongs().pipe(
            map((allSongs) => {
                const normalizedTerm = this.normalize(searchTerm).trim();
                const songs = allSongs.filter((song) =>
                    normalizedTerm ? this.normalize(song.title).includes(normalizedTerm) : true
                );

                return this.sortSongs(songs, sort).slice(0, limitResults ?? songs.length);
            })
        );
    }

    searchByTitleContains(searchTerm: string, limitResults = 20): Observable<PartialSong[]> {
        return this.getCachedSongs().pipe(
            map((allSongs) => {
                const normalizedTerm = this.normalize(searchTerm).trim();
                if (!normalizedTerm) {
                    return [];
                }

                const songs = allSongs.filter((song) => this.normalize(song.title).includes(normalizedTerm));

                return this.sortSongs(songs).slice(0, limitResults);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    searchByLyrics(searchTerm?: string, limitResults?: number): Observable<PartialSong[]> {
        return this.getCachedSongs().pipe(
            map((allSongs) => {
                const normalizedTerm = this.normalize(searchTerm);
                const songs = normalizedTerm
                    ? allSongs.filter((song) => this.normalize(song.lyrics).includes(normalizedTerm))
                    : allSongs;

                return this.sortSongs(songs).slice(0, limitResults ?? songs.length);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getLatest(pageSize = 10): Observable<PartialSong[]> {
        const q = query(collection(this._firestore, 'songs'), orderBy('creationDate', 'desc'), limit(pageSize));

        return from(getDocs(q)).pipe(
            map((snapshot) => snapshot.docs.map((doc) => doc.data() as PartialSong).filter((song) => !song.variantOf)),
            catchError((error) => this.handleError(error))
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
            await setDoc(doc(this._firestore, 'songs', song.uid), songData);
            this._songsCache$ = null;
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
            await deleteDoc(doc(this._firestore, 'songs', id));
            this._songsCache$ = null;
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
            this.showSnackbar('song_service.authentication_required', 3000, 'warning');
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

        this.showSnackbar('song_service.unexpected_error', 3000, 'error');
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
                from(getDocs(query(collection(this._firestore, 'songs'), orderBy('title')))).pipe(
                    map((snapshot) =>
                        snapshot.docs
                            .map((document) => ({ uid: document.id, ...document.data() }) as PartialSong)
                            .filter((song) => !song.variantOf)
                    ),
                    catchError((error) => this.handleError(error))
                )
            ).pipe(shareReplay({ bufferSize: 1, refCount: false }));
        }

        return this._songsCache$;
    }

    private normalize(value: string): string {
        return (value || '')
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    private compareByTitle(first: PartialSong, second: PartialSong): number {
        return (first.title || '').localeCompare(second.title || '', 'es', { sensitivity: 'base' });
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
