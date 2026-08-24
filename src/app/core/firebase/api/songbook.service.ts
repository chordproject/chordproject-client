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
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch,
} from 'firebase/firestore';
import { Observable, combineLatest, defer, from, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap, take } from 'rxjs/operators';
import { PartialSong } from 'app/models/partialsong';
import { Relation } from 'app/models/relation';
import { Songbook } from 'app/models/songbook';
import { FirebaseService } from '../firebase.service';
import { SongService } from './song.service';

@Injectable({
    providedIn: 'root',
})
export class SongbookService {
    private _firestore: Firestore;
    private _auth: Auth;
    private _translocoService: TranslocoService;
    private _songbooksCache$: Observable<Songbook[]>;

    constructor(
        private _firebase: FirebaseService,
        private _snackBar: MatSnackBar,
        private _songService: SongService
    ) {
        this._firestore = this._firebase.firestore;
        this._auth = this._firebase.auth;
        this._translocoService = inject(TranslocoService);
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
        if (!this._songbooksCache$) {
            this._songbooksCache$ = defer(() => {
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
            }).pipe(shareReplay({ bufferSize: 1, refCount: false }));
        }

        return this._songbooksCache$;
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
                this.showSnackbar('songbook_service.content_load_failed');
                return throwError(() => error);
            })
        );
    }

    async save(songbook: Songbook): Promise<string> {
        if (!this.verifyAuthentication()) {
            return null;
        }

        if (!songbook.name) {
            this.showSnackbar('songbook_service.name_required');
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
            this._songbooksCache$ = null;
            this.showSnackbar('songbook_service.songbook_saved');
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
            const existingRelations = await getDocs(
                query(
                    collection(this._firestore, 'songbook_songs'),
                    where('songbookId', '==', songbookId),
                    where('songId', '==', songId)
                )
            );

            const activeRelation = existingRelations.docs.find((relationDoc) => relationDoc.data().deleted !== true);
            if (activeRelation) {
                this.showSnackbar('songbook_service.song_already_in_songbook');
                return activeRelation.id;
            }

            const relationId = doc(
                collection(this._firestore, 'songbook_songs')
            ).id;

            const relation: Record<string, string | number> = {
                songbookId,
                songId,
            };
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
            this.showSnackbar('songbook_service.song_added');
            return relationId;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    getSongbooksForSong(songId: string): Observable<Songbook[]> {
        const relationsQuery = query(
            collection(this._firestore, 'songbook_songs'),
            where('songId', '==', songId)
        );

        return from(getDocs(relationsQuery)).pipe(
            switchMap((relationsSnapshot) => {
                const songbookIds = relationsSnapshot.docs
                    .filter((relationDoc) => relationDoc.data().deleted !== true)
                    .map((relationDoc) => relationDoc.data().songbookId)
                    .filter(Boolean);

                if (songbookIds.length === 0) {
                    return of([]);
                }

                return this.getAll().pipe(
                    map((songbooks) => songbooks.filter((songbook) => songbookIds.includes(songbook.uid)))
                );
            }),
            catchError((error) => this.handleError(error))
        );
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
                this.showSnackbar('songbook_service.song_not_found');
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

            this.showSnackbar('songbook_service.song_removed');
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
                        this.showSnackbar('songbook_service.no_songs_found');
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

    searchSongbooks(
        searchTerm?: string,
        limitResults = 3
    ): Observable<Songbook[]> {
        return this.getAll().pipe(
            map((allSongbooks) => {
                const normalizar = (str: string) =>
                    (str || '')
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                let songbooks = allSongbooks.map((songbook) => ({
                    uid: songbook.uid,
                    name: songbook.name,
                }) as Songbook);
                if (searchTerm) {
                    const qNorm = normalizar(searchTerm);
                    songbooks = songbooks.filter((sb) =>
                        normalizar(sb.name).includes(qNorm)
                    );
                }
                songbooks = songbooks.sort((a, b) =>
                    (a.name || '').localeCompare(b.name || '', 'es', {
                        sensitivity: 'base',
                    })
                );
                if (limitResults) {
                    songbooks = songbooks.slice(0, limitResults);
                }
                return songbooks;
            }),
            catchError((error) => this.handleError(error))
        );
    }

    searchSongsInSongbooks(
        searchTerm: string,
        limitSongbooks = 3,
        limitSongsPerSongbook = 3
    ): Observable<{ songbook: Songbook; songs: PartialSong[] }[]> {
        return this.getAll().pipe(
            switchMap((songbooks) => {
                if (!songbooks.length) return of([]);
                const normalizar = (str: string) =>
                    (str || '')
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                const qNorm = normalizar(searchTerm);

                // Para cada cancionero, obtener sus canciones y filtrar por el término
                return combineLatest(
                    songbooks.map((songbook) =>
                        this.getContent(songbook.uid).pipe(
                            catchError(() => of([])),
                            map((songs) => {
                                const filteredSongs = songs.filter(
                                    (song) =>
                                        normalizar(song.title).includes(
                                            qNorm
                                        ) ||
                                        normalizar(song.lyrics).includes(qNorm)
                                );
                                return {
                                    songbook,
                                    songs: filteredSongs.slice(
                                        0,
                                        limitSongsPerSongbook
                                    ),
                                };
                            })
                        )
                    )
                );
            }),
            map((results) =>
                results
                    .filter((item) => item.songs.length > 0)
                    .slice(0, limitSongbooks)
            )
        );
    }

    private verifyAuthentication(): boolean {
        const user = this._auth.currentUser;
        if (!user) {
            this.showSnackbar('songbook_service.authentication_required');
            return false;
        }
        return true;
    }

    private showSnackbar(messageKey: string, duration = 3000): void {
        this._translocoService
            .selectTranslate(messageKey)
            .pipe(
                switchMap((message) =>
                    this._translocoService
                        .selectTranslate('common.close')
                        .pipe(map((closeLabel) => ({ message, closeLabel })))
                ),
                take(1)
            )
            .subscribe(({ message, closeLabel }) => {
                this._snackBar.open(message, closeLabel, {
                    duration,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                });
            });
    }

    private handleError(error: any): Observable<never> {
        console.error('Firebase service error:', error);
        let errorMessage = 'An unexpected error occurred';

        if (error.message) {
            errorMessage = error.message;
        }

        this.showSnackbar('songbook_service.unexpected_error');
        return throwError(() => new Error(errorMessage));
    }
}
