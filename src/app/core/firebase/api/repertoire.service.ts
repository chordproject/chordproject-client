import { Injectable } from '@angular/core';
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
import { Observable, Subject, from, throwError } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { EventSlot } from 'app/models/event-slot';
import { EventType } from 'app/models/event-type';
import { Repertoire } from 'app/models/repertoire';
import { RepertoireGroup, RepertoireGroupWithChildren } from 'app/models/repertoire-group';
import { RepertoireGroupMember } from 'app/models/repertoire-group-member';
import { RepertoireSong } from 'app/models/repertoire-song';
import { AuthService } from '../auth/auth.service';
import { FirebaseService } from '../firebase.service';

@Injectable({
    providedIn: 'root',
})
export class RepertoireService {
    private readonly firestore: Firestore;
    private readonly auth: Auth;
    private readonly _changed = new Subject<void>();

    constructor(
        private readonly firebase: FirebaseService,
        private readonly authService: AuthService
    ) {
        this.firestore = firebase.firestore;
        this.auth = firebase.auth;
    }

    getEventTypes(): Observable<EventType[]> {
        return this._changed.pipe(
            startWith(undefined),
            switchMap(() => from(getDocs(query(collection(this.firestore, 'event_types'), orderBy('name'))))),
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
        return this._changed.pipe(
            startWith(undefined),
            switchMap(() => from(getDocs(query(collection(this.firestore, 'repertoires'), orderBy('date', 'desc'))))),
            map((snapshot) => snapshot.docs.map((document) => this.toRepertoire(document.id, document.data()))),
            catchError((error) => this.handleError(error))
        );
    }

    getRepertoireGroups(): Observable<RepertoireGroupWithChildren[]> {
        return this._changed.pipe(
            startWith(undefined),
            switchMap(() =>
                from(
                    Promise.all([
                        getDocs(collection(this.firestore, 'repertoire_groups')),
                        getDocs(collection(this.firestore, 'repertoire_group_members')),
                        getDocs(collection(this.firestore, 'repertoires')),
                    ])
                )
            ),
            map(([groupSnapshot, memberSnapshot, repertoireSnapshot]) => {
                const repertoiresById = new Map(
                    repertoireSnapshot.docs.map((document) => [document.id, this.toRepertoire(document.id, document.data())])
                );

                return groupSnapshot.docs
                    .map((document) => {
                        const group = { uid: document.id, ...document.data() } as RepertoireGroup;
                        const repertoires = memberSnapshot.docs
                            .map((memberDocument) => ({ uid: memberDocument.id, ...memberDocument.data() }) as RepertoireGroupMember)
                            .filter((member) => member.groupId === group.uid)
                            .sort((first, second) => first.order - second.order)
                            .map((member) => repertoiresById.get(member.repertoireId))
                            .filter((repertoire): repertoire is Repertoire => !!repertoire);

                        return { group, repertoires };
                    })
                    .sort((first, second) => Number(first.group.order ?? 0) - Number(second.group.order ?? 0));
            }),
            catchError((error) => {
                console.warn('Repertoire groups are unavailable:', error);
                return from([[] as RepertoireGroupWithChildren[]]);
            })
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

    /** Only the author (or an admin) can edit a repertoire in place; everyone else must fork their own copy. */
    isOwnedByCurrentUser(repertoire: Pick<Repertoire, 'authorId' | 'ownerId'>): boolean {
        const currentUserId = this.auth.currentUser?.uid;
        return Boolean(currentUserId) && (repertoire.authorId === currentUserId || repertoire.ownerId === currentUserId);
    }

    isSharedRepertoire(repertoire: Pick<Repertoire, 'authorId' | 'ownerId' | 'scope' | 'published'>): boolean {
        return repertoire.scope === 'shared' && repertoire.published === true;
    }

    /** Clones a repertoire and its song assignments into a personal, unpublished copy owned by the current user. */
    forkRepertoire(repertoireId: string): Observable<string | null> {
        if (!this.verifyAuthentication()) {
            return from([null]);
        }

        return from(this.copyRepertoire(repertoireId));
    }

    private async copyRepertoire(repertoireId: string): Promise<string | null> {
        try {
            const user = this.auth.currentUser;
            const sourceSnapshot = await getDoc(doc(this.firestore, 'repertoires', repertoireId));
            if (!sourceSnapshot.exists()) {
                return null;
            }

            const { uid: _uid, ...sourceData } = { uid: sourceSnapshot.id, ...sourceSnapshot.data() };
            const newRepertoireId = doc(collection(this.firestore, 'repertoires')).id;
            await setDoc(doc(this.firestore, 'repertoires', newRepertoireId), {
                ...sourceData,
                authorId: user.uid,
                ownerId: user.uid,
                scope: 'personal',
                source: 'fork',
                copiedFrom: repertoireId,
                published: false,
                creationDate: serverTimestamp(),
                lastUpdateDate: serverTimestamp(),
            });

            const songsSnapshot = await getDocs(
                query(collection(this.firestore, 'repertoire_songs'), where('repertoireId', '==', repertoireId))
            );
            if (!songsSnapshot.empty) {
                const batch = writeBatch(this.firestore);
                songsSnapshot.docs.forEach((songDoc) => {
                    const { uid: _songUid, ...songData } = { uid: songDoc.id, ...songDoc.data() };
                    const newSongRef = doc(collection(this.firestore, 'repertoire_songs'));
                    batch.set(newSongRef, {
                        ...songData,
                        repertoireId: newRepertoireId,
                        authorId: user.uid,
                        ownerId: user.uid,
                    });
                });
                await batch.commit();
            }

            this._changed.next();
            return newRepertoireId;
        } catch (error) {
            console.error('Failed to fork repertoire:', error);
            return null;
        }
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

    saveRepertoireGroup(group: RepertoireGroup): Promise<string | null> {
        return this.saveDocument('repertoire_groups', group, 'name');
    }

    async saveRepertoireGroupMembers(groupId: string, repertoireIds: string[]): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            const memberSnapshot = await getDocs(
                query(collection(this.firestore, 'repertoire_group_members'), where('groupId', '==', groupId))
            );
            const otherMemberSnapshot = repertoireIds.length
                ? await getDocs(
                    query(
                        collection(this.firestore, 'repertoire_group_members'),
                        where('repertoireId', 'in', repertoireIds)
                    )
                )
                : null;
            const batch = writeBatch(this.firestore);
            memberSnapshot.docs.forEach((member) => batch.delete(member.ref));
            otherMemberSnapshot?.docs
                .filter((member) => member.data().groupId !== groupId)
                .forEach((member) => batch.delete(member.ref));
            repertoireIds.forEach((repertoireId, order) => {
                const memberRef = doc(collection(this.firestore, 'repertoire_group_members'));
                batch.set(memberRef, {
                    groupId,
                    repertoireId,
                    order,
                    authorId: this.auth.currentUser.uid,
                });
            });
            await batch.commit();
            this._changed.next();
            return true;
        } catch {
            return false;
        }
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
            this._changed.next();
            return true;
        } catch {
            return false;
        }
    }

    async updateRepertoireSongOrder(songOrders: { uid: string; songOrder: number }[]): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            const batch = writeBatch(this.firestore);
            songOrders.forEach(({ uid, songOrder }) => {
                batch.update(doc(this.firestore, 'repertoire_songs', uid), {
                    songOrder,
                    lastUpdateDate: serverTimestamp(),
                });
            });
            await batch.commit();
            return true;
        } catch {
            return false;
        }
    }

    async deleteEventSlot(uid: string): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            await deleteDoc(doc(this.firestore, 'event_slots', uid));
            this._changed.next();
            return true;
        } catch {
            return false;
        }
    }

    async deleteEventType(uid: string): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            await deleteDoc(doc(this.firestore, 'event_types', uid));
            this._changed.next();
            return true;
        } catch {
            return false;
        }
    }

    async deleteRepertoire(uid: string): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            const snapshot = await getDocs(
                query(collection(this.firestore, 'repertoire_songs'), where('repertoireId', '==', uid))
            );

            const batch = writeBatch(this.firestore);
            snapshot.docs.forEach((document) => batch.delete(document.ref));
            batch.delete(doc(this.firestore, 'repertoires', uid));
            await batch.commit();

            this._changed.next();
            return true;
        } catch {
            return false;
        }
    }

    async deleteRepertoireGroup(uid: string): Promise<boolean> {
        if (!this.verifyAuthentication()) {
            return false;
        }

        try {
            const memberSnapshot = await getDocs(
                query(collection(this.firestore, 'repertoire_group_members'), where('groupId', '==', uid))
            );
            const batch = writeBatch(this.firestore);
            memberSnapshot.docs.forEach((member) => batch.delete(member.ref));
            batch.delete(doc(this.firestore, 'repertoire_groups', uid));
            await batch.commit();
            this._changed.next();
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
        value: EventType | EventSlot | Repertoire | RepertoireGroup | RepertoireSong,
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
        const normalizedValue = { ...value } as Record<string, unknown>;

        if (collectionName === 'repertoires') {
            normalizedValue.scope = normalizedValue.scope ?? 'personal';
            normalizedValue.published = normalizedValue.published ?? false;
        }

        const data = Object.fromEntries(
            Object.entries({
                ...normalizedValue,
                uid: undefined,
                authorId: normalizedValue.authorId || this.auth.currentUser.uid,
                creationDate: normalizedValue.creationDate || serverTimestamp(),
                lastUpdateDate: serverTimestamp(),
            }).filter(([, fieldValue]) => fieldValue !== undefined)
        );

        try {
            await setDoc(doc(this.firestore, collectionName, uid), data);
            this._changed.next();
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
        this.authService.promptSignIn();
    }
}
