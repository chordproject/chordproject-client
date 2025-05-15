import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { Auth } from 'firebase/auth';
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
    private _auth: Auth;
    private _snackBar: MatSnackBar;

    private _song: BehaviorSubject<Song | null> = new BehaviorSubject(null);

    get song$(): Observable<Song> {
        return this._song.asObservable();
    }

    constructor() {
        const firebase = inject(FirebaseService);
        this._firestore = firebase.firestore;
        this._auth = firebase.auth;
        this._snackBar = inject(MatSnackBar);
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
        if (!this.verifyAuthentication()) {
            return null;
        }

        if (!song.title) {
            this.showSnackbar('Title is required');
            return null;
        }

        try {
            const user = this._auth.currentUser;

            if (!song.uid) {
                song.uid = doc(collection(this._firestore, 'songs')).id;
                song.creationDate = serverTimestamp();
                song.source = 'homenajesus';
                song.videoId = '';
            }

            song.authorId = user.uid;

            await setDoc(doc(this._firestore, 'songs', song.uid), { ...song });
            this.showSnackbar('Song saved successfully');
            return song.uid;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    async delete(id: string): Promise<boolean> {
        if (!this.verifyAuthentication()) {
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

    private verifyAuthentication(): boolean {
        const user = this._auth.currentUser;
        if (!user) {
            this.showSnackbar('Authentication required');
            return false;
        }
        return true;
    }

    private showSnackbar(message: string, duration: number = 3000): void {
        this._snackBar.open(message, 'Close', {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }

    private handleError(error: any): Observable<never> {
        console.error('Firebase service error:', error);
        let errorMessage = 'An unexpected error occurred';

        if (error.message) {
            errorMessage = error.message;
        }

        this.showSnackbar(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

    getTags() {
        return null;
    }
}
