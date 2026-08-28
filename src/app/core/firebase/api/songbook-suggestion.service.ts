import { Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { Observable, Subject, from, map, of } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { SongbookSuggestion, SongbookSuggestionType } from 'app/models/songbook-suggestion';
import { SongbookService } from './songbook.service';
import { FirebaseService } from '../firebase.service';

export type CreateSongbookSuggestionInput = {
    type: SongbookSuggestionType;
    targetSongbookId?: string;
    targetSongId?: string;
    targetParentId?: string;
    suggestedName?: string;
    message: string;
};

@Injectable({ providedIn: 'root' })
export class SongbookSuggestionService {
    private firestore: Firestore;
    private auth: Auth;
    private _changed = new Subject<void>();

    constructor(private firebase: FirebaseService, private _songbookService: SongbookService) {
        this.firestore = firebase.firestore;
        this.auth = firebase.auth;
    }

    create(value: CreateSongbookSuggestionInput): Observable<string | null> {
        if (!this.auth.currentUser) {
            return of(null);
        }

        return from(this.createSuggestion(value));
    }

    getMineOpenForSongbookSong(songbookId: string, songId: string): Observable<SongbookSuggestion | null> {
        const user = this.auth.currentUser;
        if (!user) {
            return of(null);
        }

        return from(getDocs(query(collection(this.firestore, 'songbook_suggestions'), where('authorId', '==', user.uid)))).pipe(
            map((snapshot) => {
                const match = snapshot.docs.find((suggestionDoc) => {
                    const suggestion = suggestionDoc.data();
                    return suggestion.status === 'open' && suggestion.type === 'add_song' && suggestion.targetSongbookId === songbookId && suggestion.targetSongId === songId;
                });
                return match ? ({ ...match.data(), uid: match.id } as SongbookSuggestion) : null;
            }),
            catchError(() => of(null))
        );
    }

    getMineOpenSongbookAssignments(songId: string): Observable<SongbookSuggestion[]> {
        const user = this.auth.currentUser;
        if (!user || !songId) {
            return of([]);
        }

        return from(getDocs(query(collection(this.firestore, 'songbook_suggestions'), where('authorId', '==', user.uid)))).pipe(
            map((snapshot) => snapshot.docs
                .map((suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id }) as SongbookSuggestion)
                .filter((suggestion) =>
                    suggestion.status === 'open' &&
                    suggestion.type === 'add_song' &&
                    suggestion.targetSongId === songId &&
                    Boolean(suggestion.targetSongbookId)
                )
            ),
            catchError(() => of([]))
        );
    }

    getAllOpen(): Observable<SongbookSuggestion[]> {
        return new Observable<SongbookSuggestion[]>((subscriber) => {
            const q = query(collection(this.firestore, 'songbook_suggestions'), where('status', '==', 'open'));
            return onSnapshot(q,
                (snapshot) => {
                    const suggestions = this.sortByCreationDateDesc(snapshot.docs.map((suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id } as SongbookSuggestion)));
                    subscriber.next(suggestions);
                },
                (error) => {
                    subscriber.error(error);
                }
            );
        }).pipe(catchError(() => of([])));
    }

    getHistory(): Observable<SongbookSuggestion[]> {
        return this._changed.pipe(
            startWith(undefined),
            switchMap(() => {
                const acceptedQuery = query(collection(this.firestore, 'songbook_suggestions'), where('status', '==', 'accepted'));
                const rejectedQuery = query(collection(this.firestore, 'songbook_suggestions'), where('status', '==', 'rejected'));

                return from(Promise.all([getDocs(acceptedQuery), getDocs(rejectedQuery)])).pipe(
                    map(([acceptedSnapshot, rejectedSnapshot]) =>
                        this.sortByCreationDateDesc(
                            [...acceptedSnapshot.docs, ...rejectedSnapshot.docs].map(
                                (suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id }) as SongbookSuggestion
                            )
                        )
                    ),
                    catchError(() => of([]))
                );
            })
        );
    }

    getMine(): Observable<SongbookSuggestion[]> {
        const user = this.auth.currentUser;
        if (!user) {
            return of([]);
        }

        const q = query(collection(this.firestore, 'songbook_suggestions'), where('authorId', '==', user.uid));

        return from(getDocs(q)).pipe(
            map((snapshot) => this.sortByCreationDateDesc(snapshot.docs.map((suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id }) as SongbookSuggestion))),
            catchError(() => of([]))
        );
    }

    approve(suggestion: SongbookSuggestion, responseMessage?: string): Observable<boolean> {
        if (suggestion.type === 'add_song' && suggestion.targetSongbookId && suggestion.targetSongId) {
            return from(this._songbookService.addSong(suggestion.targetSongbookId, suggestion.targetSongId)).pipe(
                switchMap((relationId) => relationId ? from(this.updateStatus(suggestion.uid, 'accepted', responseMessage)).pipe(map(() => true)) : of(false)),
                catchError(() => of(false))
            );
        }

        return from(this.updateStatus(suggestion.uid, 'accepted', responseMessage)).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    reject(suggestion: SongbookSuggestion, responseMessage?: string): Observable<boolean> {
        return from(this.updateStatus(suggestion.uid, 'rejected', responseMessage)).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    forkAndAddSuggestedSong(suggestion: SongbookSuggestion): Observable<string | null> {
        if (suggestion.type !== 'add_song' || !suggestion.targetSongbookId || !suggestion.targetSongId) {
            return of(null);
        }

        return this._songbookService.forkMany([suggestion.targetSongbookId]).pipe(
            switchMap(([songbookId]) =>
                songbookId
                    ? from(this._songbookService.addSong(songbookId, suggestion.targetSongId)).pipe(map((relationId) => relationId ? songbookId : null))
                    : of(null)
            ),
            catchError(() => of(null))
        );
    }

    cancel(suggestion: SongbookSuggestion): Observable<boolean> {
        return from(setDoc(doc(this.firestore, 'songbook_suggestions', suggestion.uid), { status: 'rejected' }, { merge: true })).pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }

    private async updateStatus(suggestionId: string, status: 'accepted' | 'rejected', responseMessage?: string): Promise<void> {
        const update: Record<string, unknown> = { status, lastUpdateDate: serverTimestamp() };
        if (responseMessage) {
            update.responseMessage = responseMessage.trim();
        }

        await setDoc(doc(this.firestore, 'songbook_suggestions', suggestionId), update, { merge: true });
        this._changed.next();
    }

    private sortByCreationDateDesc(suggestions: SongbookSuggestion[]): SongbookSuggestion[] {
        return [...suggestions].sort((first, second) => this.toMillis(second.creationDate) - this.toMillis(first.creationDate));
    }

    private toMillis(value: unknown): number {
        return (value as { toMillis?: () => number })?.toMillis?.() ?? 0;
    }

    private async createSuggestion(value: CreateSongbookSuggestionInput): Promise<string> {
        const user = this.auth.currentUser;
        const suggestionId = doc(collection(this.firestore, 'songbook_suggestions')).id;
        const suggestion: Omit<SongbookSuggestion, 'uid'> = {
            authorId: user.uid,
            ownerId: user.uid,
            authorName: user.displayName || user.email || user.uid,
            creationDate: serverTimestamp(),
            lastUpdateDate: serverTimestamp() as never,
            source: 'user',
            type: value.type,
            status: 'open',
            targetSongbookId: value.targetSongbookId,
            targetSongId: value.targetSongId,
            targetParentId: value.targetParentId,
            suggestedName: value.suggestedName?.trim() || undefined,
            message: value.message.trim(),
        };

        await setDoc(
            doc(this.firestore, 'songbook_suggestions', suggestionId),
            Object.fromEntries(Object.entries(suggestion).filter(([, fieldValue]) => fieldValue !== undefined))
        );

        this._changed.next();
        return suggestionId;
    }
}
