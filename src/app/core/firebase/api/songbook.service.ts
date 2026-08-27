import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    documentId,
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
import { Observable, Subject, combineLatest, defer, from, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, take } from 'rxjs/operators';
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
    private _personalSongbooksCache$: Observable<Songbook[]>;
    private _recommendedSongbooksCache$: Observable<Songbook[]>;
    private _songbooksChanged = new Subject<void>();

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
                    return { ...docSnap.data(), uid: docSnap.id } as Songbook;
                } else {
                    throw new Error(`Songbook with ID ${id} not found`);
                }
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getAll(): Observable<Songbook[]> {
        if (!this._songbooksCache$) {
            this._songbooksCache$ = this._songbooksChanged.pipe(
                startWith(undefined),
                switchMap(() => {
                    const q = query(
                        collection(this._firestore, 'songbooks'),
                        orderBy('name')
                    );

                    return from(getDocs(q)).pipe(
                        map((snapshot) =>
                            snapshot.docs.map(
                                (doc) =>
                                    ({
                                        ...doc.data(),
                                        uid: doc.id,
                                    }) as Songbook
                            )
                        ),
                        catchError((error) => this.handleError(error))
                    );
                }),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }

        return this._songbooksCache$;
    }

    getPersonal(): Observable<Songbook[]> {
        return this.getAll().pipe(
            map((songbooks) => songbooks.filter((songbook) =>
                this.isActiveSongbook(songbook) && this.isPersonalSongbook(songbook) && this.isOwnedByCurrentUser(songbook)
            ))
        );
    }

    getRecommended(): Observable<Songbook[]> {
        if (!this._recommendedSongbooksCache$) {
            this._recommendedSongbooksCache$ = this.getAll().pipe(
                map((songbooks) => songbooks.filter((songbook) => this.isActiveSongbook(songbook) && this.isRecommendedSongbook(songbook))),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }

        return this._recommendedSongbooksCache$;
    }

    getByParent(parent: string): Observable<Songbook[]> {
        return this.getPersonalByParent(parent);
    }

    getChildren(parent: string): Observable<Songbook[]> {
        return this._songbooksChanged.pipe(
            startWith(undefined),
            switchMap(() => this.getByParentQuery(parent)),
            map((songbooks) => songbooks.filter((songbook) => this.isActiveSongbook(songbook))),
            catchError((error) => this.handleError(error))
        );
    }

    getPersonalByParent(parent: string): Observable<Songbook[]> {
        return this._songbooksChanged.pipe(
            startWith(undefined),
            switchMap(() => this.getByParentQuery(parent)),
            map((songbooks) => songbooks.filter((songbook) =>
                this.isActiveSongbook(songbook) && this.isPersonalSongbook(songbook) && this.isOwnedByCurrentUser(songbook)
            )),
            catchError((error) => this.handleError(error))
        );
    }

    private getByParentQuery(parent: string): Observable<Songbook[]> {
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
                            ...doc.data(),
                            uid: doc.id,
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
            songbook.ownerId = songbook.ownerId || user.uid;
            songbook.scope = songbook.scope || 'personal';
            songbook.published = songbook.published ?? false;
            songbook.isTemplate = songbook.isTemplate ?? false;

            await setDoc(doc(this._firestore, 'songbooks', songbook.uid), {
                ...songbook,
            });
            this.clearSongbooksCache();
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
            songId = await this.getCanonicalSongId(songId);
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
                relation.ownerId = this._auth.currentUser.uid;
            }

            await setDoc(
                doc(this._firestore, 'songbook_songs', relationId),
                relation
            );
            await this.markSongbookCustomized(songbookId);
            this.showSnackbar('songbook_service.song_added');
            return relationId;
        } catch (error) {
            this.handleError(error);
            return null;
        }
    }

    async copySongRelations(sourceSongId: string, targetSongId: string): Promise<boolean> {
        if (!(await this.verifyAuthentication())) {
            return false;
        }

        try {
            const relationsSnapshot = await getDocs(
                query(
                    collection(this._firestore, 'songbook_songs'),
                    where('songId', '==', sourceSongId)
                )
            );
            const activeRelations = relationsSnapshot.docs.filter((relationDoc) => relationDoc.data().deleted !== true);

            const batch = writeBatch(this._firestore);
            activeRelations.forEach((relationDoc) => {
                const data = relationDoc.data();
                batch.set(doc(collection(this._firestore, 'songbook_songs')), {
                    ...data,
                    songId: targetSongId,
                });
            });
            await batch.commit();
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    forkMany(songbookIds: string[]): Observable<string[]> {
        if (!this.verifyAuthentication()) {
            return of([]);
        }

        return from(this.forkSongbooks(songbookIds));
    }

    deleteCopies(songbookIds: string[]): Observable<boolean> {
        if (!this.verifyAuthentication()) {
            return of(false);
        }

        return from(this.deleteCopiedSongbooks(songbookIds));
    }

    getSongbooksForSong(songId: string): Observable<Songbook[]> {
        return from(this.getCanonicalSongId(songId)).pipe(
            switchMap((canonicalSongId) => {
                const relationsQuery = query(
                    collection(this._firestore, 'songbook_songs'),
                    where('songId', '==', canonicalSongId)
                );

                return from(getDocs(relationsQuery));
            }),
            switchMap((relationsSnapshot) => {
                const songbookIds = relationsSnapshot.docs
                    .filter((relationDoc) => relationDoc.data().deleted !== true)
                    .map((relationDoc) => relationDoc.data().songbookId)
                    .filter(Boolean);

                if (songbookIds.length === 0) {
                    return of([]);
                }

                return from(Promise.all(
                    [...new Set(songbookIds)].map(async (songbookId) => {
                        const songbookSnapshot = await getDoc(doc(this._firestore, 'songbooks', songbookId));
                        return songbookSnapshot.exists()
                            ? ({ ...songbookSnapshot.data(), uid: songbookSnapshot.id } as Songbook)
                            : null;
                    })
                )).pipe(
                    map((songbooks) => {
                        const visibleSongbooks = songbooks.filter((songbook): songbook is Songbook =>
                            Boolean(songbook) && this.isActiveSongbook(songbook) && this.isVisibleToCurrentUser(songbook)
                        );

                        // Hide a recommended songbook once the current user has their own personal copy of it.
                        const copiedSourceIds = new Set(
                            visibleSongbooks.filter((songbook) => this.isOwnedByCurrentUser(songbook)).map((songbook) => songbook.copiedFrom).filter(Boolean)
                        );

                        return visibleSongbooks.filter((songbook) => !copiedSourceIds.has(songbook.uid));
                    })
                );
            }),
            catchError((error) => this.handleError(error))
        );
    }

    private async getCanonicalSongId(songId: string): Promise<string> {
        const songSnapshot = await getDoc(doc(this._firestore, 'songs', songId));
        return songSnapshot.exists() ? songSnapshot.data().variantOf || songId : songId;
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
                    ...relationDoc.data(),
                    deleted: true,
                    deletedAt: serverTimestamp(),
                },
                { merge: true }
            );

            await this.markSongbookCustomized(songbookId);

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
                    await this.markSongbookCustomized(songbookId);
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
        return combineLatest([this.getPersonal(), this.getRecommended()]).pipe(
            map(([personalSongbooks, recommendedSongbooks]) => {
                const allSongbooks = [...personalSongbooks, ...recommendedSongbooks];
                const normalizar = (str: string) =>
                    (str || '')
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                let songbooks = allSongbooks
                    .filter((songbook, index, values) => values.findIndex((value) => value.uid === songbook.uid) === index)
                    .map((songbook) => ({ ...songbook }));
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
            take(1),
            catchError((error) => this.handleError(error))
        );
    }

    searchSongsInSongbooks(
        searchTerm: string,
        limitSongbooks = 3,
        limitSongsPerSongbook = 3
    ): Observable<{ songbook: Songbook; songs: PartialSong[] }[]> {
        return this.getPersonal().pipe(
            switchMap((songbooks) => {
                if (!songbooks.length) return of([]);
                const normalizar = (str: string) =>
                    (str || '')
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '');
                const qNorm = normalizar(searchTerm);

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

    private isPersonalSongbook(songbook: Songbook): boolean {
        return !this.isRecommendedSongbook(songbook);
    }

    private isActiveSongbook(songbook: Songbook): boolean {
        return songbook.deleted !== true;
    }

    private isRecommendedSongbook(songbook: Songbook): boolean {
        return songbook.scope === 'shared' && songbook.published === true;
    }

    private isOwnedByCurrentUser(songbook: Songbook): boolean {
        const currentUserId = this._auth.currentUser?.uid;
        return Boolean(currentUserId) && (songbook.authorId === currentUserId || songbook.ownerId === currentUserId);
    }

    private isVisibleToCurrentUser(songbook: Songbook): boolean {
        return this.isRecommendedSongbook(songbook) || this.isOwnedByCurrentUser(songbook);
    }

    private clearSongbooksCache(): void {
        this._songbooksChanged.next();
    }

    private async forkSongbooks(songbookIds: string[]): Promise<string[]> {
        try {
            const user = this._auth.currentUser;
            const uniqueSongbookIds = [...new Set(songbookIds.filter(Boolean))];
            const sourceSnapshots = await Promise.all(
                uniqueSongbookIds.map((songbookId) => getDoc(doc(this._firestore, 'songbooks', songbookId)))
            );
            const existingCopyDocs = await this.getCurrentUserSongbooks();
            const copyIdsBySourceId = new Map(
                existingCopyDocs
                    .filter((documentSnapshot) => documentSnapshot.data().deleted !== true)
                    .map((documentSnapshot) => [documentSnapshot.data().copiedFrom, documentSnapshot.id] as [string, string])
                    .filter(([copiedFrom]) => Boolean(copiedFrom))
            );
            const sourceSongbooks = sourceSnapshots
                .filter((sourceSnapshot) => sourceSnapshot.exists())
                .map((sourceSnapshot) => ({ ...sourceSnapshot.data(), uid: sourceSnapshot.id }) as Songbook);

            if (sourceSongbooks.length === 0) {
                return [];
            }

            const songbookIdMap = new Map<string, string>();
            const songbooksBatch = writeBatch(this._firestore);
            let songbooksToCreate = 0;

            sourceSongbooks.forEach((sourceSongbook) => {
                songbookIdMap.set(
                    sourceSongbook.uid,
                    copyIdsBySourceId.get(sourceSongbook.uid) || doc(collection(this._firestore, 'songbooks')).id
                );
            });

            for (const sourceSongbook of sourceSongbooks) {
                if (copyIdsBySourceId.has(sourceSongbook.uid)) {
                    continue;
                }

                const newSongbookId = songbookIdMap.get(sourceSongbook.uid);
                const { uid, ...sourceSongbookData } = sourceSongbook;
                songbooksToCreate += 1;

                songbooksBatch.set(doc(this._firestore, 'songbooks', newSongbookId), this.withoutUndefined({
                    ...sourceSongbookData,
                    name: sourceSongbook.name,
                    parent: sourceSongbook.parent ? songbookIdMap.get(sourceSongbook.parent) || '' : '',
                    authorId: user.uid,
                    ownerId: user.uid,
                    scope: 'personal',
                    source: 'fork',
                    copiedFrom: sourceSongbook.uid,
                    syncStatus: 'customized',
                    customizedAt: serverTimestamp(),
                    published: false,
                    isTemplate: false,
                    creationDate: serverTimestamp(),
                    lastUpdateDate: serverTimestamp(),
                }));
            }

            if (songbooksToCreate > 0) {
                await songbooksBatch.commit();
            }

            let relationsBatch = writeBatch(this._firestore);
            let relationWrites = 0;

            for (const sourceSongbook of sourceSongbooks) {
                const newSongbookId = songbookIdMap.get(sourceSongbook.uid);
                const relationsSnapshot = await getDocs(
                    query(collection(this._firestore, 'songbook_songs'), where('songbookId', '==', sourceSongbook.uid))
                );
                const activeSourceRelations = relationsSnapshot.docs.filter((relationDoc) => relationDoc.data().deleted !== true);
                const existingTargetRelationsSnapshot = await getDocs(
                    query(collection(this._firestore, 'songbook_songs'), where('songbookId', '==', newSongbookId))
                );
                const copiedRelationIds = new Set(
                    existingTargetRelationsSnapshot.docs
                        .map((relationDoc) => relationDoc.data().copiedFrom)
                        .filter(Boolean)
                );
                const targetSongIds = new Set(
                    existingTargetRelationsSnapshot.docs
                        .map((relationDoc) => relationDoc.data().songId)
                        .filter(Boolean)
                );
                const existingSongIds = await this.getExistingSongIds(
                    activeSourceRelations.map((relationDoc) => relationDoc.data().songId).filter(Boolean)
                );

                const relationsToCopy = activeSourceRelations
                    .filter((relationDoc) => !copiedRelationIds.has(relationDoc.id))
                    .filter((relationDoc) => !targetSongIds.has(relationDoc.data().songId))
                    .filter((relationDoc) => existingSongIds.has(relationDoc.data().songId));

                for (const relationDoc of relationsToCopy) {
                    const relationId = doc(collection(this._firestore, 'songbook_songs')).id;
                    relationWrites += 1;
                    relationsBatch.set(doc(this._firestore, 'songbook_songs', relationId), this.withoutUndefined({
                        ...relationDoc.data(),
                        songbookId: newSongbookId,
                        author_uid: user.uid,
                        ownerId: user.uid,
                        copiedFrom: relationDoc.id,
                    }));

                    if (relationWrites === 3) {
                        await relationsBatch.commit();
                        relationsBatch = writeBatch(this._firestore);
                        relationWrites = 0;
                    }
                }
            }

            if (relationWrites > 0) {
                await relationsBatch.commit();
            }
            this.clearSongbooksCache();
            this.showSnackbar('songbook_service.songbook_saved');
            return sourceSongbooks.map((sourceSongbook) => songbookIdMap.get(sourceSongbook.uid));
        } catch (error) {
            this.handleError(error);
            return [];
        }
    }

    private async deleteCopiedSongbooks(songbookIds: string[]): Promise<boolean> {
        try {
            const user = this._auth.currentUser;
            const targetIds = new Set(songbookIds.filter(Boolean));
            const existingCopyDocs = await this.getCurrentUserSongbooks();
            const directTargetDocs = await this.getSongbooksByIds([...targetIds]);
            const candidateDocs = this.uniqueDocuments([...existingCopyDocs, ...directTargetDocs]);

            const targetCopiedSourceIds = candidateDocs
                .filter((documentSnapshot) => targetIds.has(documentSnapshot.id))
                .map((documentSnapshot) => documentSnapshot.data().copiedFrom)
                .filter(Boolean);

            candidateDocs
                .filter((documentSnapshot) => targetIds.has(documentSnapshot.data().parent))
                .forEach((documentSnapshot) => targetIds.add(documentSnapshot.id));

            candidateDocs
                .filter((documentSnapshot) => targetCopiedSourceIds.includes(documentSnapshot.data().copiedFrom))
                .forEach((documentSnapshot) => targetIds.add(documentSnapshot.id));

            if (targetIds.size === 0) {
                return false;
            }

            const songbooksBatch = writeBatch(this._firestore);
            let songbookWrites = 0;

            candidateDocs
                .filter((documentSnapshot) => targetIds.has(documentSnapshot.id))
                .filter((documentSnapshot) => documentSnapshot.data().ownerId === user.uid || documentSnapshot.data().authorId === user.uid)
                .filter((documentSnapshot) => documentSnapshot.data().copiedFrom)
                .forEach((documentSnapshot) => {
                    songbooksBatch.update(documentSnapshot.ref, {
                        deleted: true,
                        deletedAt: serverTimestamp(),
                        lastUpdateDate: serverTimestamp(),
                    });
                    songbookWrites += 1;
                });

            if (songbookWrites === 0) {
                return false;
            }

            await songbooksBatch.commit();

            const relationsBatch = writeBatch(this._firestore);
            let relationWrites = 0;

            for (const songbookId of targetIds) {
                const relationsSnapshot = await getDocs(
                    query(collection(this._firestore, 'songbook_songs'), where('songbookId', '==', songbookId))
                );

                relationsSnapshot.docs
                    .filter((relationDoc) => relationDoc.data().ownerId === user.uid)
                    .forEach((relationDoc) => {
                        relationsBatch.update(relationDoc.ref, {
                            deleted: true,
                            deletedAt: serverTimestamp(),
                        });
                        relationWrites += 1;
                    });
            }

            if (relationWrites > 0) {
                await relationsBatch.commit();
            }

            this.clearSongbooksCache();
            this.showSnackbar('songbook_service.copy_removed');
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    private async getCurrentUserSongbooks() {
        const user = this._auth.currentUser;
        const [ownerSnapshot, authorSnapshot] = await Promise.all([
            getDocs(query(collection(this._firestore, 'songbooks'), where('ownerId', '==', user.uid))),
            getDocs(query(collection(this._firestore, 'songbooks'), where('authorId', '==', user.uid))),
        ]);
        const documentsById = new Map(ownerSnapshot.docs.map((documentSnapshot) => [documentSnapshot.id, documentSnapshot]));

        authorSnapshot.docs.forEach((documentSnapshot) => {
            documentsById.set(documentSnapshot.id, documentSnapshot);
        });

        return [...documentsById.values()];
    }

    private async getSongbooksByIds(songbookIds: string[]) {
        const snapshots = await Promise.all(
            songbookIds.map((songbookId) => getDoc(doc(this._firestore, 'songbooks', songbookId)))
        );

        return snapshots.filter((snapshot) => snapshot.exists());
    }

    private uniqueDocuments(documents: any[]) {
        return [...new Map(documents.map((documentSnapshot) => [documentSnapshot.id, documentSnapshot])).values()];
    }

    private async markSongbookCustomized(songbookId: string): Promise<boolean> {
        try {
            const snapshot = await getDoc(doc(this._firestore, 'songbooks', songbookId));

            if (!snapshot.exists()) {
                return false;
            }

            const data = snapshot.data();
            if (data.ownerId !== this._auth.currentUser.uid || data.syncStatus === 'customized') {
                return false;
            }

            await setDoc(snapshot.ref, {
                ...data,
                syncStatus: 'customized',
                customizedAt: serverTimestamp(),
                lastUpdateDate: serverTimestamp(),
            }, { merge: true });
            this.clearSongbooksCache();
            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    private verifyAuthentication(): boolean {
        const user = this._auth.currentUser;
        if (!user) {
            this.showSnackbar('songbook_service.authentication_required');
            return false;
        }
        return true;
    }

    private withoutUndefined(value: Record<string, unknown>): Record<string, unknown> {
        return Object.fromEntries(
            Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
        );
    }

    private async getExistingSongIds(songIds: string[]): Promise<Set<string>> {
        const uniqueSongIds = [...new Set(songIds)];
        const chunks = Array.from({ length: Math.ceil(uniqueSongIds.length / 30) }, (_, index) =>
            uniqueSongIds.slice(index * 30, (index + 1) * 30)
        );
        const snapshots = await Promise.all(
            chunks
                .filter((chunk) => chunk.length > 0)
                .map((chunk) => getDocs(query(collection(this._firestore, 'songs'), where(documentId(), 'in', chunk))))
        );

        return new Set(snapshots.flatMap((snapshot) => snapshot.docs.map((documentSnapshot) => documentSnapshot.id)));
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
