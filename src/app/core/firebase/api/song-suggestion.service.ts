import { Injectable, inject } from '@angular/core';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { Observable, Subject, from, map, of, switchMap } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Song } from 'app/models/song';
import { SongSuggestion, SongSuggestionOutcome, SongSuggestionProposedFields } from 'app/models/song-suggestion';
import { FirebaseService } from '../firebase.service';
import { SongService } from './song.service';

export type CreateSongSuggestionInput = {
    targetSongId: string;
    proposedSong: SongSuggestionProposedFields;
    proposedOutcome?: SongSuggestionOutcome;
    message?: string;
};

export const MAX_ALTERNATE_VERSIONS = 5;

@Injectable({ providedIn: 'root' })
export class SongSuggestionService {
    private _firestore: Firestore;
    private _auth: Auth;
    private _songService = inject(SongService);
    private _changed = new Subject<void>();

    constructor() {
        const firebase = inject(FirebaseService);
        this._firestore = firebase.firestore;
        this._auth = firebase.auth;
    }

    create(input: CreateSongSuggestionInput): Observable<string | null> {
        if (!this._auth.currentUser) {
            return of(null);
        }

        return this.getMineOpenForSong(input.targetSongId).pipe(
            switchMap((existing) => from(this.createOrUpdateSuggestion(input, existing?.uid))),
            catchError((error) => {
                console.error('Failed to create/update song suggestion:', error);
                return of(null);
            })
        );
    }

    getMineOpenForSong(songId: string): Observable<SongSuggestion | null> {
        const user = this._auth.currentUser;
        if (!user || !songId) {
            return of(null);
        }

        const q = query(
            collection(this._firestore, 'song_suggestions'),
            where('targetSongId', '==', songId),
            where('authorId', '==', user.uid),
            where('status', '==', 'open')
        );

        return from(getDocs(q)).pipe(
            map((snapshot) => (snapshot.empty ? null : ({ ...snapshot.docs[0].data(), uid: snapshot.docs[0].id } as SongSuggestion))),
            catchError(() => of(null))
        );
    }

    getMine(): Observable<SongSuggestion[]> {
        const user = this._auth.currentUser;
        if (!user) {
            return of([]);
        }

        const q = query(collection(this._firestore, 'song_suggestions'), where('authorId', '==', user.uid));

        return from(getDocs(q)).pipe(
            map((snapshot) => this.sortByCreationDateDesc(snapshot.docs.map((suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id }) as SongSuggestion))),
            catchError(() => of([]))
        );
    }

    getAllOpen(): Observable<SongSuggestion[]> {
        return new Observable<SongSuggestion[]>((subscriber) => {
            const q = query(collection(this._firestore, 'song_suggestions'), where('status', '==', 'open'));
            return onSnapshot(q,
                (snapshot) => {
                    const suggestions = this.sortByCreationDateDesc(snapshot.docs.map((suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id } as SongSuggestion)));
                    subscriber.next(suggestions);
                },
                (error) => {
                    subscriber.error(error);
                }
            );
        }).pipe(catchError(() => of([])));
    }

    getHistory(): Observable<SongSuggestion[]> {
        return this._changed.pipe(
            startWith(undefined),
            switchMap(() => {
                const acceptedQuery = query(collection(this._firestore, 'song_suggestions'), where('status', '==', 'accepted'));
                const rejectedQuery = query(collection(this._firestore, 'song_suggestions'), where('status', '==', 'rejected'));

                return from(Promise.all([getDocs(acceptedQuery), getDocs(rejectedQuery)])).pipe(
                    map(([acceptedSnapshot, rejectedSnapshot]) =>
                        this.sortByCreationDateDesc(
                            [...acceptedSnapshot.docs, ...rejectedSnapshot.docs].map(
                                (suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id }) as SongSuggestion
                            )
                        )
                    ),
                    catchError(() => of([]))
                );
            })
        );
    }

    approve(suggestion: SongSuggestion, responseMessage?: string): Observable<boolean> {
        return from(this.getTargetSong(suggestion.targetSongId)).pipe(
            switchMap((targetSong) => {
                if (!targetSong) {
                    return of(false);
                }

                return from(
                    this._songService.save({
                        ...targetSong,
                        ...suggestion.proposedSong,
                    } as Song)
                ).pipe(
                    switchMap((savedId) =>
                        savedId ? from(this.updateStatus(suggestion.uid, 'accepted', responseMessage)).pipe(map(() => true)) : of(false)
                    )
                );
            }),
            catchError(() => of(false))
        );
    }

    reject(suggestion: SongSuggestion, responseMessage?: string): Observable<boolean> {
        return from(this.updateStatus(suggestion.uid, 'rejected', responseMessage)).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    createVersion(suggestion: SongSuggestion, responseMessage?: string): Observable<string | null> {
        return from(this.getVariantCount(suggestion.targetSongId)).pipe(
            switchMap((variantCount) => {
                if (variantCount >= MAX_ALTERNATE_VERSIONS) {
                    return of(null);
                }

                return from(this.getTargetSong(suggestion.targetSongId));
            }),
            switchMap((targetSong) => {
                if (!targetSong) {
                    return of(null);
                }

                const newSong: Song = {
                    ...targetSong,
                    ...suggestion.proposedSong,
                    uid: undefined,
                    variantOf: suggestion.targetSongId,
                } as Song;

                return from(this._songService.save(newSong)).pipe(
                    switchMap((newSongId) =>
                        newSongId
                            ? from(this.updateStatus(suggestion.uid, 'accepted', responseMessage, newSongId)).pipe(map(() => newSongId))
                            : of(null)
                    )
                );
            }),
            catchError(() => of(null))
        );
    }

    private async getVariantCount(originalSongId: string): Promise<number> {
        const snapshot = await getDocs(
            query(collection(this._firestore, 'songs'), where('variantOf', '==', originalSongId))
        );
        return snapshot.size;
    }

    private async createOrUpdateSuggestion(input: CreateSongSuggestionInput, existingId?: string): Promise<string> {
        const user = this._auth.currentUser;
        const suggestionId = existingId || doc(collection(this._firestore, 'song_suggestions')).id;
        const proposedSong = Object.fromEntries(
            Object.entries(input.proposedSong).filter(([, value]) => value !== undefined)
        ) as SongSuggestionProposedFields;

        const suggestion: Partial<Omit<SongSuggestion, 'uid'>> = existingId
            ? {
                  proposedSong,
                  message: input.message?.trim() || undefined,
                  status: 'open',
                  lastUpdateDate: serverTimestamp() as never,
              }
            : {
                  authorId: user.uid,
                  ownerId: user.uid,
                  authorName: user.displayName || user.email || user.uid,
                  creationDate: serverTimestamp(),
                  lastUpdateDate: serverTimestamp() as never,
                  source: 'user',
                  targetSongId: input.targetSongId,
                proposedOutcome: input.proposedOutcome || 'official',
                  proposedSong,
                  status: 'open',
                  message: input.message?.trim() || undefined,
              };

        await setDoc(
            doc(this._firestore, 'song_suggestions', suggestionId),
            Object.fromEntries(Object.entries(suggestion).filter(([, value]) => value !== undefined)),
            { merge: true }
        );

        this._changed.next();
        return suggestionId;
    }

    private async getTargetSong(songId: string): Promise<Song | null> {
        const snapshot = await getDoc(doc(this._firestore, 'songs', songId));
        return snapshot.exists() ? (snapshot.data() as Song) : null;
    }

    private sortByCreationDateDesc(suggestions: SongSuggestion[]): SongSuggestion[] {
        return [...suggestions].sort((first, second) => this.toMillis(second.creationDate) - this.toMillis(first.creationDate));
    }

    private toMillis(value: unknown): number {
        return (value as { toMillis?: () => number })?.toMillis?.() ?? 0;
    }

    private async updateStatus(
        suggestionId: string,
        status: 'accepted' | 'rejected',
        responseMessage?: string,
        resultSongId?: string
    ): Promise<void> {
        const update: Record<string, unknown> = { status, lastUpdateDate: serverTimestamp() };
        if (responseMessage) {
            update.responseMessage = responseMessage.trim();
        }
        if (resultSongId) {
            update.resultSongId = resultSongId;
        }

        await setDoc(doc(this._firestore, 'song_suggestions', suggestionId), update, { merge: true });
        this._changed.next();
    }
}
