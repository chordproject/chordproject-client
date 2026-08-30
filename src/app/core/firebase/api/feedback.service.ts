import { Injectable, inject } from '@angular/core';
import { Auth } from 'firebase/auth';
import { Firestore, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { Observable, Subject, from, map, of, startWith, switchMap } from 'rxjs';
import { FirebaseService } from '../firebase.service';
import { Feedback, FeedbackType } from 'app/models/feedback';

export type CreateFeedbackInput = {
    type: FeedbackType;
    title: string;
    message: string;
    pageUrl?: string;
    allowContact?: boolean;
    contactEmail?: string;
};

@Injectable({ providedIn: 'root' })
export class FeedbackService {
    private _firestore: Firestore;
    private _auth: Auth;
    private _changed = new Subject<void>();
    private _openRequested = new Subject<void>();
    openRequested$ = this._openRequested.asObservable();

    constructor() {
        const firebase = inject(FirebaseService);
        this._firestore = firebase.firestore;
        this._auth = firebase.auth;
    }

    create(input: CreateFeedbackInput): Observable<string | null> {
        const title = input.title.trim();
        const message = input.message.trim();
        if (!title || !message) {
            return of(null);
        }

        return from(this.createFeedback({ ...input, title, message }));
    }

    getAllOpen(): Observable<Feedback[]> {
        return this._changed.pipe(
            startWith(undefined),
            switchMap(() => from(getDocs(query(collection(this._firestore, 'feedback'), where('status', '==', 'open'))))),
            map((snapshot) => snapshot.docs.map((feedbackDoc) => ({ ...feedbackDoc.data(), uid: feedbackDoc.id }) as Feedback)),
        );
    }

    requestOpen(): void {
        this._openRequested.next();
    }

    private async createFeedback(input: CreateFeedbackInput): Promise<string> {
        const feedbackId = doc(collection(this._firestore, 'feedback')).id;
        const user = this._auth.currentUser;
        const feedback: Record<string, unknown> = {
            type: input.type,
            status: 'open',
            title: input.title,
            message: input.message,
            pageUrl: input.pageUrl || undefined,
            allowContact: input.allowContact ?? false,
            contactEmail: input.contactEmail || undefined,
            authorId: user?.uid || null,
            authorName: user?.displayName || user?.email || input.contactEmail || undefined,
            ownerId: user?.uid || undefined,
            source: 'user',
            creationDate: serverTimestamp(),
            lastUpdateDate: serverTimestamp(),
        };

        await setDoc(
            doc(this._firestore, 'feedback', feedbackId),
            Object.fromEntries(Object.entries(feedback).filter(([, value]) => value !== undefined))
        );
        this._changed.next();
        return feedbackId;
    }
}
