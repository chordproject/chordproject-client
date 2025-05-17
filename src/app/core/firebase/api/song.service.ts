import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'app/core/user/user.service';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { environment } from 'environments/environment';
import {
    Firestore,
    QueryConstraint,
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
import {
    BehaviorSubject,
    Observable,
    combineLatest,
    firstValueFrom,
    from,
    throwError,
} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FirebaseService } from '../firebase.service';

@Injectable({
    providedIn: 'root',
})
export class SongService {
    private _firestore: Firestore;
    private _snackBar: MatSnackBar;
    private _userService: UserService;

    private _song: BehaviorSubject<Song | null> = new BehaviorSubject(null);

    get song$(): Observable<Song> {
        return this._song.asObservable();
    }

    constructor() {
        const firebase = inject(FirebaseService);
        this._firestore = firebase.firestore;
        this._snackBar = inject(MatSnackBar);
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
        const idChunks = Array.from(
            { length: Math.ceil(ids.length / chunkSize) },
            (_, i) => ids.slice(i * chunkSize, (i + 1) * chunkSize)
        );

        const observables = idChunks.map((chunk) => {
            return from(
                getDocs(
                    query(
                        collection(this._firestore, 'songs'),
                        where('uid', 'in', chunk)
                    )
                )
            ).pipe(
                map((snapshot) =>
                    snapshot.docs.map((doc) => doc.data() as PartialSong)
                )
            );
        });

        return combineLatest(observables).pipe(
            map((results) => results.flat()),
            catchError((error) => this.handleError(error))
        );
    }

    getList(searchTerm?: string): Observable<PartialSong[]> {
        const songsRef = collection(this._firestore, 'songs');
        const constraints: QueryConstraint[] = [orderBy('title')];

        const q = query(songsRef, ...constraints);
        return from(getDocs(q)).pipe(
            map((snapshot) => {
                let songs = snapshot.docs.map(
                    (doc) => doc.data() as PartialSong
                );
                if (searchTerm) {
                    songs = songs.filter(
                        (song) =>
                            song.title &&
                            song.title
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
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
                return songs;
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getLatest(pageSize: number = 10): Observable<PartialSong[]> {
        const q = query(
            collection(this._firestore, 'songs'),
            orderBy('creationDate', 'desc'),
            limit(pageSize)
        );

        return from(getDocs(q)).pipe(
            map((snapshot) =>
                snapshot.docs.map((doc) => doc.data() as PartialSong)
            ),
            catchError((error) => this.handleError(error))
        );
    }

    async save(song: Song): Promise<string> {
        if (!(await this.verifyAuthentication())) {
            return null;
        }

        if (!song.title) {
            this.showSnackbar('Title is required', 3000, 'warning');
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

            await setDoc(doc(this._firestore, 'songs', song.uid), { ...song });
            this.showSnackbar('Song saved successfully');
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
            this.showSnackbar('Song deleted successfully');
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    private async verifyAuthentication(): Promise<boolean> {
        const isAuthenticated = await firstValueFrom(
            this._userService.isAuthenticated()
        );
        if (!isAuthenticated) {
            this.showSnackbar('Authentication required', 3000, 'warning');
            return false;
        }
        return true;
    }

    private showSnackbar(
        message: string,
        duration: number = 3000,
        type?: string
    ): void {
        this._snackBar.open(message, 'Close', {
            duration,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: type ? [type] : [],
        });
    }

    private handleError(error: any): Observable<never> {
        console.error('Firebase service error:', error);
        let errorMessage = 'An unexpected error occurred';

        if (error.message) {
            errorMessage = error.message;
        }

        this.showSnackbar(errorMessage, 3000, 'error');
        return throwError(() => new Error(errorMessage));
    }

    getTags() {
        return null;
    }
}
