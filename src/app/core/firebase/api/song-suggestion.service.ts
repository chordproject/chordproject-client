import { Injectable, inject } from '@angular/core';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Song } from 'app/models/song';
import { SongSuggestion, SongSuggestionProposedFields } from 'app/models/song-suggestion';
import { FirebaseService } from '../firebase.service';
import { SongService } from './song.service';

export type CreateSongSuggestionInput = {
    targetSongId: string;
    proposedSong: SongSuggestionProposedFields;
    message?: string;
};

@Injectable({ providedIn: 'root' })
export class SongSuggestionService {
    private _firestore: Firestore;
    private _auth: Auth;
    private _songService = inject(SongService);

    constructor() {
        const firebase = inject(FirebaseService);
        this._firestore = firebase.firestore;
        this._auth = firebase.auth;
    }

    create(input: CreateSongSuggestionInput): Observable<string | null> {
        if (!this._auth.currentUser) {
            return of(null);
        }

        return from(this.createSuggestion(input));
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
        const q = query(collection(this._firestore, 'song_suggestions'), where('status', '==', 'open'));

        return from(getDocs(q)).pipe(
            map((snapshot) => this.sortByCreationDateDesc(snapshot.docs.map((suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id }) as SongSuggestion))),
            catchError(() => of([]))
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
        return from(this.getTargetSong(suggestion.targetSongId)).pipe(
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

    private async createSuggestion(input: CreateSongSuggestionInput): Promise<string> {
        const user = this._auth.currentUser;
        const suggestionId = doc(collection(this._firestore, 'song_suggestions')).id;
        const suggestion: Omit<SongSuggestion, 'uid'> = {
            authorId: user.uid,
            ownerId: user.uid,
            creationDate: serverTimestamp(),
            lastUpdateDate: serverTimestamp() as never,
            source: 'user',
            targetSongId: input.targetSongId,
            proposedSong: Object.fromEntries(
                Object.entries(input.proposedSong).filter(([, value]) => value !== undefined)
            ) as SongSuggestionProposedFields,
            status: 'open',
            message: input.message?.trim() || undefined,
        };

        await setDoc(
            doc(this._firestore, 'song_suggestions', suggestionId),
            Object.fromEntries(Object.entries(suggestion).filter(([, value]) => value !== undefined))
        );

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
    }
}
