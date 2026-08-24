import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
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
import { BehaviorSubject, Observable, Subject, combineLatest, firstValueFrom, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { UserService } from 'app/core/user/user.service';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { Tag } from 'app/models/tag';
import { environment } from 'environments/environment';
import { FirebaseService } from '../firebase.service';

@Injectable({
    providedIn: 'root',
})
export class SongService {
    private _firestore: Firestore;
    private _snackBar: MatSnackBar;
    private _translocoService: TranslocoService;
    private _userService: UserService;
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

    searchByTitle(searchTerm?: string, limitResults?: number): Observable<PartialSong[]> {
        const songsRef = collection(this._firestore, 'songs');
        const q = searchTerm
            ? query(
                  songsRef,
                  orderBy('title'),
                  where('title', '>=', searchTerm),
                  where('title', '<=', `${searchTerm}\uf8ff`),
                  ...(limitResults ? [limit(limitResults)] : [])
              )
            : query(songsRef, orderBy('title'));
        return from(getDocs(q)).pipe(
            map((snapshot) => {
                const normalizar = (str: string) =>
                    (str || '')
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                let songs = snapshot.docs.map((doc) => doc.data() as PartialSong);
                if (searchTerm) {
                    const qNorm = normalizar(searchTerm);
                    songs = songs.filter(
                        (song) => song.title && normalizar(song.title).includes(qNorm)
                    );
                }
                // Ordenar ignorando acentos
                songs = songs.sort((a, b) =>
                    a.title.localeCompare(b.title, 'es', {
                        sensitivity: 'base',
                    })
                );
                // Agregar campo auxiliar para agrupación por inicial normalizada
                songs = songs.map((song) => ({
                    ...song,
                    normalizedInitial: song.title
                        ? song.title
                              .trim()
                              .charAt(0)
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .toUpperCase()
                        : '',
                }));
                if (limitResults) {
                    songs = songs.slice(0, limitResults);
                }
                return songs;
            }),
            catchError((error) => this.handleError(error))
        );
    }

    searchByTitleContains(searchTerm: string, limitResults = 20): Observable<PartialSong[]> {
        const songsRef = collection(this._firestore, 'songs');
        return from(getDocs(query(songsRef, orderBy('title')))).pipe(
            map((snapshot) => {
                const normalizedTerm = (searchTerm || '')
                    .toLocaleLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .trim();
                if (!normalizedTerm) {
                    return [];
                }

                return snapshot.docs
                    .map((document) => ({ uid: document.id, ...document.data() }) as PartialSong)
                    .filter((song) => {
                        const normalizedTitle = (song.title || '')
                            .toLocaleLowerCase()
                            .normalize('NFD')
                            .replace(/[\u0300-\u036f]/g, '');
                        return normalizedTitle.includes(normalizedTerm);
                    })
                    .sort((first, second) =>
                        (first.title || '').localeCompare(second.title || '', 'es', {
                            sensitivity: 'base',
                        })
                    )
                    .slice(0, limitResults);
            }),
            catchError((error) => this.handleError(error))
        );
    }

    searchByLyrics(searchTerm?: string, limitResults?: number): Observable<PartialSong[]> {
        const songsRef = collection(this._firestore, 'songs');
        const q = query(songsRef, orderBy('title'));
        return from(getDocs(q)).pipe(
            map((snapshot) => {
                const normalizar = (str: string) =>
                    (str || '')
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                let songs = snapshot.docs.map((doc) => doc.data() as PartialSong);
                if (searchTerm) {
                    const qNorm = normalizar(searchTerm);
                    songs = songs.filter((song) => song.lyrics && normalizar(song.lyrics).includes(qNorm));
                }
                // Ordenar ignorando acentos
                songs = songs.sort((a, b) =>
                    (a.title || '').localeCompare(b.title || '', 'es', {
                        sensitivity: 'base',
                    })
                );
                if (limitResults) {
                    songs = songs.slice(0, limitResults);
                }
                return songs;
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getLatest(pageSize = 10): Observable<PartialSong[]> {
        const q = query(collection(this._firestore, 'songs'), orderBy('creationDate', 'desc'), limit(pageSize));

        return from(getDocs(q)).pipe(
            map((snapshot) => snapshot.docs.map((doc) => doc.data() as PartialSong)),
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
            }

            song.authorId = userUid;

            const songData = Object.fromEntries(
                Object.entries(song).filter(([, value]) => value !== undefined)
            );
            await setDoc(doc(this._firestore, 'songs', song.uid), songData);
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
