import { Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    where,
} from 'firebase/firestore';
import { Observable, from, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SongbookSuggestion, SongbookSuggestionType } from 'app/models/songbook-suggestion';
import { FirebaseService } from '../firebase.service';

export type CreateSongbookSuggestionInput = {
    type: SongbookSuggestionType;
    targetSongbookId?: string;
    targetParentId?: string;
    suggestedName?: string;
    message: string;
};

@Injectable({ providedIn: 'root' })
export class SongbookSuggestionService {
    private firestore: Firestore;
    private auth: Auth;

    constructor(private firebase: FirebaseService) {
        this.firestore = firebase.firestore;
        this.auth = firebase.auth;
    }

    create(value: CreateSongbookSuggestionInput): Observable<string | null> {
        if (!this.auth.currentUser) {
            return of(null);
        }

        return from(this.createSuggestion(value));
    }

    getAllOpen(): Observable<SongbookSuggestion[]> {
        const q = query(collection(this.firestore, 'songbook_suggestions'), where('status', '==', 'open'));

        return from(getDocs(q)).pipe(
            map((snapshot) => this.sortByCreationDateDesc(snapshot.docs.map((suggestionDoc) => ({ ...suggestionDoc.data(), uid: suggestionDoc.id }) as SongbookSuggestion))),
            catchError(() => of([]))
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

    private async updateStatus(suggestionId: string, status: 'accepted' | 'rejected', responseMessage?: string): Promise<void> {
        const update: Record<string, unknown> = { status, lastUpdateDate: serverTimestamp() };
        if (responseMessage) {
            update.responseMessage = responseMessage.trim();
        }

        await setDoc(doc(this.firestore, 'songbook_suggestions', suggestionId), update, { merge: true });
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
            creationDate: serverTimestamp(),
            lastUpdateDate: serverTimestamp() as never,
            source: 'user',
            type: value.type,
            status: 'open',
            targetSongbookId: value.targetSongbookId,
            targetParentId: value.targetParentId,
            suggestedName: value.suggestedName?.trim() || undefined,
            message: value.message.trim(),
        };

        await setDoc(
            doc(this.firestore, 'songbook_suggestions', suggestionId),
            Object.fromEntries(Object.entries(suggestion).filter(([, fieldValue]) => fieldValue !== undefined))
        );

        return suggestionId;
    }
}
