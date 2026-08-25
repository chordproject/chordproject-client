import { Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { Observable, from, of } from 'rxjs';
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
