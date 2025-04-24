import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { 
    Firestore, 
    collection, 
    doc, 
    setDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter, 
    serverTimestamp, 
    QueryConstraint 
} from 'firebase/firestore';
import { FirebaseService } from '../firebase.service';
import { Observable, from, throwError, combineLatest } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth, User } from 'firebase/auth';

export interface Song {
    uid: string;
    title: string;
    artists?: string[];
    lyrics?: string;
    songKey?: string;
    uniqueChords?: string[];
    creationDate?: any;
    source?: string;
    authorId?: string;
    videoId?: string;
    liked?: boolean;
}

export interface PartialSong {
    uid: string;
    title: string;
    songKey?: string;
    artists?: string[];
    lyrics?: string;
    uniqueChords?: string[];
    order?: number;
}

@Injectable({
    providedIn: 'root'
})
export class SongService {
    private _firestore: Firestore;
    private _auth: Auth;
    private _snackBar: MatSnackBar;

    constructor() {
        const firebase = inject(FirebaseService);
        this._firestore = firebase.firestore;
        this._auth = firebase.auth;
        this._snackBar = inject(MatSnackBar);
    }

    /**
     * Get a song by ID
     */
    get(id: string): Observable<Song> {
        return from(getDoc(doc(this._firestore, 'songs', id)))
            .pipe(
                map(docSnap => {
                    if (docSnap.exists()) {
                        return { uid: docSnap.id, ...docSnap.data() } as Song;
                    } else {
                        throw new Error(`Song with ID ${id} not found`);
                    }
                }),
                catchError(error => this.handleError(error))
            );
    }

    /**
     * Get songs by IDs
     */
    getAll(ids: string[]): Observable<PartialSong[]> {
        if (!ids || ids.length === 0) {
            return from([[]]);
        }

        // Firebase limits "in" queries to 30 items, so chunk the requests
        const chunkSize = 30;
        const idChunks = Array.from(
            { length: Math.ceil(ids.length / chunkSize) }, 
            (_, i) => ids.slice(i * chunkSize, (i + 1) * chunkSize)
        );

        const observables = idChunks.map(chunk => {
            return from(
                getDocs(
                    query(
                        collection(this._firestore, 'songs'),
                        where('uid', 'in', chunk)
                    )
                )
            ).pipe(
                map(snapshot => 
                    snapshot.docs.map(doc => ({
                        uid: doc.id,
                        title: doc.data().title,
                        songKey: doc.data().songKey
                    } as PartialSong))
                )
            );
        });

        return combineLatest(observables).pipe(
            map(results => results.flat()),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Get a list of songs
     */
    getList(
        lastTitle?: string,
        searchTerm?: string,
        pageSize: number = 30,
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Observable<PartialSong[]> {
        const songsRef = collection(this._firestore, 'songs');
        const constraints: QueryConstraint[] = [orderBy('title', sortOrder), limit(pageSize)];

        if (lastTitle) {
            constraints.push(startAfter(lastTitle));
        }

        if (searchTerm) {
            const end = searchTerm + '\uf8ff';
            constraints.push(where('title', '>=', searchTerm), where('title', '<=', end));
        }

        const q = query(songsRef, ...constraints);

        return from(getDocs(q)).pipe(
            map(snapshot => 
                snapshot.docs.map(doc => ({
                    uid: doc.id,
                    title: doc.data().title,
                    artists: doc.data().artists,
                    lyrics: doc.data().lyrics,
                    songKey: doc.data().songKey,
                    uniqueChords: doc.data().uniqueChords
                } as PartialSong))
            ),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Get latest songs
     */
    getLatest(pageSize: number = 5): Observable<PartialSong[]> {
        const q = query(
            collection(this._firestore, 'songs'),
            orderBy('creationDate', 'desc'),
            limit(pageSize)
        );

        return from(getDocs(q)).pipe(
            map(snapshot => 
                snapshot.docs.map(doc => ({
                    uid: doc.id,
                    title: doc.data().title,
                    artists: doc.data().artists,
                    lyrics: doc.data().lyrics,
                    songKey: doc.data().songKey,
                    uniqueChords: doc.data().uniqueChords
                } as PartialSong))
            ),
            catchError(error => this.handleError(error))
        );
    }

    /**
     * Save a song
     */
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
                song.source = 'homenajesus'; // Set appropriate source
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

    /**
     * Delete a song
     */
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

    /**
     * Check if user is authenticated
     */
    private verifyAuthentication(): boolean {
        const user = this._auth.currentUser;
        if (!user) {
            this.showSnackbar('Authentication required');
            return false;
        }
        return true;
    }

    /**
     * Show snackbar message
     */
    private showSnackbar(message: string, duration: number = 3000): void {
        this._snackBar.open(message, 'Close', {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }

    /**
     * Handle errors
     */
    private handleError(error: any): Observable<never> {
        console.error('Firebase service error:', error);
        let errorMessage = 'An unexpected error occurred';
        
        if (error.message) {
            errorMessage = error.message;
        }
        
        this.showSnackbar(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
