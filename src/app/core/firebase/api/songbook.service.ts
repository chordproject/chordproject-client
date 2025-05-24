import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartialSong } from 'app/models/partialsong';
import { Relation } from 'app/models/relation';
import { Songbook } from 'app/models/songbook';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch,
} from 'firebase/firestore';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { FirebaseService } from '../firebase.service';
import { SongService } from './song.service';

@Injectable({
    providedIn: 'root',
})
export class SongbookService {
    private _firestore: Firestore;
    private _auth: Auth;

    constructor(
        private _firebase: FirebaseService,
        private _snackBar: MatSnackBar,
        private _songService: SongService
    ) {
        this._firestore = this._firebase.firestore;
        this._auth = this._firebase.auth;
    }

    get(id: string): Observable<Songbook> {
        return from(getDoc(doc(this._firestore, 'songbooks', id))).pipe(
            map((docSnap) => {
                if (docSnap.exists()) {
                    return { uid: docSnap.id, ...docSnap.data() } as Songbook;
                } else {
                    throw new Error(`Songbook with ID ${id} not found`);
                }
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getAll(): Observable<Songbook[]> {
        const q = query(
            collection(this._firestore, 'songbooks'),
            orderBy('name')
        );

        return from(getDocs(q)).pipe(
            map((snapshot) =>
                snapshot.docs.map(
                    (doc) =>
                        ({
                            uid: doc.id,
                            ...doc.data(),
                        }) as Songbook
                )
            ),
            catchError((error) => this.handleError(error))
        );
    }

    getByParent(parent: string): Observable<Songbook[]> {
        const q = query(
            collection(this._firestore, 'songbooks'),
            where('parent', '==', parent),
            orderBy('order'),
            orderBy('name')
        );

        return from(getDocs(q)).pipe(
            map((snapshot) =>
                snapshot.docs.map(
                    (doc) =>
                        ({
                            uid: doc.id,
                            ...doc.data(),
                        }) as Songbook
                )
            ),
            catchError((error) => this.handleError(error))
        );
    }

    getContent(songbookId: string): Observable<PartialSong[]> {
        const relationsRef = collection(this._firestore, 'songbook_songs');
        const q = query(relationsRef, where('songbookId', '==', songbookId));

        return from(getDocs(q)).pipe(
            switchMap((relationsSnapshot) => {
                if (relationsSnapshot.empty) {
                    return of([]);
                }

                const relations = relationsSnapshot.docs.map((doc) => {
                    const data = doc.data();
                    const relation = new Relation(data.songbookId, data.songId);

                    if (data.author_uid) {
                        relation.author_uid = data.author_uid;
                    }
                    if (data.order !== undefined) {
                        relation.order = data.order;
                    }

                    return relation;
                });

                const songIds = relations.map((relation) => relation.songId);

                return this._songService.getAll(songIds).pipe(
                    map((songs) => {
                        const songsWithOrder = songs.map((song) => {
                            const relation = relations.find(
                                (rel) => rel.songId === song.uid
                            );

                            return {
                                ...song,
                                order: relation?.order ?? null,
                                author_uid: relation?.author_uid,
                            };
                        });

                        return songsWithOrder.sort((a, b) => {
                            if (a.order !== null && b.order !== null) {
                                return a.order - b.order;
                            } else if (a.order === null && b.order === null) {
                                return a.title.localeCompare(b.title);
                            } else {
                                return a.order === null ? 1 : -1;
                            }
                        });
                    })
                );
            }),
            catchError((error) => {
                console.error('Error fetching songbook content:', error);
                this.showSnackbar('Failed to load songbook content');
                return of([]);
            })
        );
    }

    async save(songbook: Songbook): Promise<string> {
        if (!this.verifyAuthentication()) {
            return null;
        }

        if (!songbook.name) {
            this.showSnackbar('Name is required');
            return null;
        }

        try {
            const user = this._auth.currentUser;

            if (!songbook.uid) {
                songbook.uid = doc(collection(this._firestore, 'songbooks')).id;
                songbook.creationDate = serverTimestamp();
                songbook.source = 'homenajesus';
            }

            songbook.authorId = user.uid;

            await setDoc(doc(this._firestore, 'songbooks', songbook.uid), {
                ...songbook,
            });
            this.showSnackbar('Songbook saved successfully');
            return songbook.uid;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    async addSong(
        songbookId: string,
        songId: string,
        order?: number
    ): Promise<string> {
        if (!this.verifyAuthentication()) {
            return null;
        }

        try {
            const relationId = doc(
                collection(this._firestore, 'songbook_songs')
            ).id;

            const relation = new Relation(songbookId, songId);
            if (order !== undefined) {
                relation.order = order;
            }

            if (this._auth.currentUser) {
                relation.author_uid = this._auth.currentUser.uid;
            }

            await setDoc(
                doc(this._firestore, 'songbook_songs', relationId),
                relation
            );
            this.showSnackbar('Song added to songbook');
            return relationId;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    async removeSong(songbookId: string, songId: string): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            const q = query(
                collection(this._firestore, 'songbook_songs'),
                where('songbookId', '==', songbookId),
                where('songId', '==', songId)
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                this.showSnackbar('Song not found in songbook');
                return false;
            }

            const relationDoc = snapshot.docs[0];
            await setDoc(
                doc(this._firestore, 'songbook_songs', relationDoc.id),
                {
                    deleted: true,
                    deletedAt: serverTimestamp(),
                },
                { merge: true }
            );

            this.showSnackbar('Song removed from songbook');
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    updateSongOrder(
        songbookId: string,
        songOrders: { songId: string; order: number }[]
    ): Observable<boolean> {
        if (!this.verifyAuthentication()) {
            return of(false);
        }

        return from(
            (async () => {
                try {
                    const q = query(
                        collection(this._firestore, 'songbook_songs'),
                        where('songbookId', '==', songbookId)
                    );

                    const snapshot = await getDocs(q);

                    if (snapshot.empty) {
                        this.showSnackbar('No songs found in songbook');
                        return false;
                    }

                    const relationDocs = {};
                    snapshot.docs.forEach((doc) => {
                        const data = doc.data();
                        relationDocs[data.songId] = doc.id;
                    });

                    const batch = writeBatch(this._firestore);

                    for (const item of songOrders) {
                        if (relationDocs[item.songId]) {
                            const docRef = doc(
                                this._firestore,
                                'songbook_songs',
                                relationDocs[item.songId]
                            );
                            batch.update(docRef, { order: item.order });
                        }
                    }

                    await batch.commit();
                    return true;
                } catch (error) {
                    this.handleError(error);
                    return false;
                }
            })()
        );
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
}
