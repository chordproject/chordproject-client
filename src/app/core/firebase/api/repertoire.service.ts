import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Auth } from 'firebase/auth';
import {
    Firestore,
    collection,
    deleteDoc,
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
import { Observable, from, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { EventSlot } from 'app/models/event-slot';
import { EventType } from 'app/models/event-type';
import { Repertoire } from 'app/models/repertoire';
import { RepertoireSong } from 'app/models/repertoire-song';
import { FirebaseService } from '../firebase.service';

@Injectable({
    providedIn: 'root',
})
export class RepertoireService {
    private readonly firestore: Firestore;
    private readonly auth: Auth;

    constructor(
        private readonly firebase: FirebaseService,
        private readonly snackBar: MatSnackBar,
        private readonly translocoService: TranslocoService
    ) {
        this.firestore = firebase.firestore;
        this.auth = firebase.auth;
    }

    getEventTypes(): Observable<EventType[]> {
        return from(getDocs(query(collection(this.firestore, 'event_types'), orderBy('name')))).pipe(
            map((snapshot) => snapshot.docs.map((document) => ({ uid: document.id, ...document.data() }) as EventType)),
            catchError((error) => this.handleError(error))
        );
    }

    getEventType(uid: string): Observable<EventType> {
        return from(getDoc(doc(this.firestore, 'event_types', uid))).pipe(
            map((snapshot) => {
                if (!snapshot.exists()) {
                    throw new Error(`Event type with ID ${uid} not found`);
                }
                return { uid: snapshot.id, ...snapshot.data() } as EventType;
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getEventSlots(eventTypeId: string): Observable<EventSlot[]> {
        return from(
            getDocs(
                query(
                    collection(this.firestore, 'event_slots'),
                    where('eventTypeId', '==', eventTypeId)
                )
            )
        ).pipe(
            map((snapshot) =>
                snapshot.docs
                    .map((document) => ({ uid: document.id, ...document.data() }) as EventSlot)
                    .sort((first, second) => first.order - second.order)
            ),
            catchError((error) => this.handleError(error))
        );
    }

    getRepertoires(): Observable<Repertoire[]> {
        return from(getDocs(query(collection(this.firestore, 'repertoires'), orderBy('date', 'desc')))).pipe(
            map((snapshot) => snapshot.docs.map((document) => this.toRepertoire(document.id, document.data()))),
            catchError((error) => this.handleError(error))
        );
    }

    getRepertoire(uid: string): Observable<Repertoire> {
        return from(getDoc(doc(this.firestore, 'repertoires', uid))).pipe(
            map((snapshot) => {
                if (!snapshot.exists()) {
                    throw new Error(`Repertoire with ID ${uid} not found`);
                }
                return this.toRepertoire(snapshot.id, snapshot.data());
            }),
            catchError((error) => this.handleError(error))
        );
    }

    getRepertoireSongs(repertoireId: string): Observable<RepertoireSong[]> {
        return from(
            getDocs(
                query(
                    collection(this.firestore, 'repertoire_songs'),
                    where('repertoireId', '==', repertoireId)
                )
            )
        ).pipe(
            map((snapshot) =>
                snapshot.docs
                    .map((document) => ({ uid: document.id, ...document.data() }) as RepertoireSong)
                    .sort(
                        (first, second) =>
                            first.order - second.order || (first.songOrder || 0) - (second.songOrder || 0)
                    )
            ),
            catchError((error) => this.handleError(error))
        );
    }

    saveEventType(eventType: EventType): Promise<string | null> {
        return this.saveDocument('event_types', eventType, 'name');
    }

    saveEventSlot(eventSlot: EventSlot): Promise<string | null> {
        return this.saveDocument('event_slots', eventSlot, 'name');
    }

    saveRepertoire(repertoire: Repertoire): Promise<string | null> {
        return this.saveDocument('repertoires', repertoire, 'title');
    }

    saveRepertoireSong(repertoireSong: RepertoireSong): Promise<string | null> {
        return this.saveDocument('repertoire_songs', repertoireSong, 'songId');
    }

    async deleteRepertoireSong(uid: string): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            await deleteDoc(doc(this.firestore, 'repertoire_songs', uid));
            return true;
        } catch {
            return false;
        }
    }

    saveRepertoireSlotStatus(
        repertoireId: string,
        slotId: string,
        order: number,
        status: 'assigned' | 'skipped'
    ): Promise<string | null> {
        return this.saveDocument('repertoire_songs', {
            uid: `${repertoireId}_${slotId}`,
            repertoireId,
            songId: '__skipped__',
            slotId,
            order,
            status,
        } as RepertoireSong);
    }

    private toRepertoire(uid: string, data: Record<string, any>): Repertoire {
        const date = data.date?.toDate ? data.date.toDate() : data.date;
        const additionalDates = data.additionalDates?.map((value: any) =>
            value?.toDate ? value.toDate() : value
        );

        return {
            uid,
            ...data,
            date,
            additionalDates,
        } as Repertoire;
    }

    async updateEventSlotOrder(eventTypeId: string, slotOrders: { uid: string; order: number }[]): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            const snapshot = await getDocs(
                query(collection(this.firestore, 'event_slots'), where('eventTypeId', '==', eventTypeId))
            );
            const documentIds = new Map(snapshot.docs.map((document) => [document.id, document.id]));
            const batch = writeBatch(this.firestore);

            slotOrders.forEach(({ uid, order }) => {
                if (documentIds.has(uid)) {
                    batch.update(doc(this.firestore, 'event_slots', uid), {
                        order,
                        lastUpdateDate: serverTimestamp(),
                    });
                }
            });

            await batch.commit();
            return true;
        } catch (error) {
            console.error('Firebase repertoire slot order error:', error);
            return false;
        }
    }

    private async saveDocument(
        collectionName: string,
        value: EventType | EventSlot | Repertoire | RepertoireSong,
        requiredField?: 'name' | 'title' | 'songId'
    ): Promise<string | null> {
        if (!this.auth.currentUser) {
            this.showAuthenticationRequired();
            return null;
        }

        if (requiredField && !value[requiredField]) {
            return null;
        }

        const uid = value.uid || doc(collection(this.firestore, collectionName)).id;
        const data = Object.fromEntries(
            Object.entries({
                ...value,
                uid: undefined,
                authorId: value.authorId || this.auth.currentUser.uid,
                creationDate: value.creationDate || serverTimestamp(),
                lastUpdateDate: serverTimestamp(),
            }).filter(([, fieldValue]) => fieldValue !== undefined)
        );

        try {
            await setDoc(doc(this.firestore, collectionName, uid), data);
            return uid;
        } catch {
            return null;
        }
    }

    private handleError(error: unknown): Observable<never> {
        console.error('Firebase repertoire service error:', error);
        return throwError(() => error);
    }

    private verifyAuthentication(): boolean {
        if (this.auth.currentUser) {
            return true;
        }

        this.showAuthenticationRequired();
        return false;
    }

    private showAuthenticationRequired(): void {
        this.translocoService
            .selectTranslate('song_service.authentication_required')
            .pipe(
                switchMap((message) =>
                    this.translocoService
                        .selectTranslate('common.close')
                        .pipe(map((closeLabel) => ({ message, closeLabel })))
                ),
                take(1)
            )
            .subscribe(({ message, closeLabel }) => {
                this.snackBar.open(message, closeLabel, {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    panelClass: ['warning'],
                });
            });
    }
}
