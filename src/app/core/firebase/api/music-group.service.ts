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
    updateDoc,
    where,
    writeBatch,
} from 'firebase/firestore';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MusicGroup, MusicGroupMembership } from 'app/models/music-group';
import { FirebaseService } from '../firebase.service';

@Injectable({ providedIn: 'root' })
export class MusicGroupService {
    private readonly firestore: Firestore;
    private readonly auth: Auth;

    constructor() {
        const firebase = inject(FirebaseService);
        this.firestore = firebase.firestore;
        this.auth = firebase.auth;
    }

    getMyGroup(): Observable<{ group: MusicGroup; membership: MusicGroupMembership } | null> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(null);
        }

        return from(getDoc(doc(this.firestore, 'users', userId))).pipe(
            switchMap((userSnapshot) => {
                const groupId = userSnapshot.data()?.['groupId'];
                return groupId ? from(getDoc(doc(this.firestore, 'music_groups', groupId))) : of(null);
            }),
            switchMap((groupSnapshot) => {
                if (!groupSnapshot?.exists()) {
                    return of(null);
                }
                return from(getDocs(query(
                    collection(this.firestore, 'music_group_members'),
                    where('groupId', '==', groupSnapshot.id),
                    where('userId', '==', userId)
                ))).pipe(
                    map((membershipSnapshot) => membershipSnapshot.empty
                        ? null
                        : {
                            group: { uid: groupSnapshot.id, ...groupSnapshot.data() } as MusicGroup,
                            membership: { uid: membershipSnapshot.docs[0].id, ...membershipSnapshot.docs[0].data() } as MusicGroupMembership,
                        })
                );
            }),
            catchError((error) => this.handleError(error))
        );
    }

    createGroup(name: string): Observable<MusicGroup> {
        const userId = this.auth.currentUser?.uid;
        if (!userId || !name.trim()) {
            return throwError(() => new Error('Authentication and group name are required'));
        }

        return from(this.writeGroup(name.trim(), userId)).pipe(catchError((error) => this.handleError(error)));
    }

    joinGroup(code: string): Observable<MusicGroup> {
        const userId = this.auth.currentUser?.uid;
        if (!userId || !code.trim()) {
            return throwError(() => new Error('Authentication and group code are required'));
        }

        return from(this.joinByCode(code.trim().toUpperCase(), userId)).pipe(catchError((error) => this.handleError(error)));
    }

    leaveGroup(): Observable<boolean> {
        const userId = this.auth.currentUser?.uid;
        if (!userId) {
            return of(false);
        }

        return from(getDoc(doc(this.firestore, 'users', userId))).pipe(
            switchMap((userSnapshot) => {
                const groupId = userSnapshot.data()?.['groupId'];
                if (!groupId) {
                    return of(false);
                }
                return from(this.clearMembership(userId, groupId));
            }),
            catchError((error) => this.handleError(error))
        );
    }

    dismissGroupPrompt(): Observable<boolean> {
        const userId = this.auth.currentUser?.uid;
        return userId
            ? from(updateDoc(doc(this.firestore, 'users', userId), { groupPromptDismissed: true })).pipe(map(() => true), catchError((error) => this.handleError(error)))
            : of(false);
    }

    private async writeGroup(name: string, userId: string): Promise<MusicGroup> {
        const userSnapshot = await getDoc(doc(this.firestore, 'users', userId));
        if (userSnapshot.data()?.groupId) {
            throw new Error('User already belongs to a group');
        }

        const code = this.createCode();
        const groupRef = doc(this.firestore, 'music_groups', code);
        const membershipRef = doc(collection(this.firestore, 'music_group_members'));
        const group = {
            name,
            code,
            ownerId: userId,
            status: 'active',
            creationDate: serverTimestamp(),
            lastUpdateDate: serverTimestamp(),
        };
        const batch = writeBatch(this.firestore);
        batch.set(groupRef, group);
        batch.set(membershipRef, {
            groupId: groupRef.id,
            userId,
            role: 'owner',
            status: 'active',
            creationDate: serverTimestamp(),
        });
        batch.set(doc(this.firestore, 'users', userId), { groupId: groupRef.id, groupPromptDismissed: true }, { merge: true });
        await batch.commit();
        return { uid: groupRef.id, ...group } as MusicGroup;
    }

    private async joinByCode(code: string, userId: string): Promise<MusicGroup> {
        const userSnapshot = await getDoc(doc(this.firestore, 'users', userId));
        if (userSnapshot.data()?.groupId) {
            throw new Error('User already belongs to a group');
        }

        const groupSnapshot = await getDoc(doc(this.firestore, 'music_groups', code));
        if (!groupSnapshot.exists() || groupSnapshot.data().status !== 'active') {
            throw new Error('Group not found');
        }

        const membershipRef = doc(collection(this.firestore, 'music_group_members'));
        const batch = writeBatch(this.firestore);
        batch.set(membershipRef, {
            groupId: groupSnapshot.id,
            userId,
            role: 'member',
            status: 'active',
            creationDate: serverTimestamp(),
        });
        batch.set(doc(this.firestore, 'users', userId), { groupId: groupSnapshot.id, groupPromptDismissed: true }, { merge: true });
        await batch.commit();
        return { uid: groupSnapshot.id, ...groupSnapshot.data() } as MusicGroup;
    }

    private async clearMembership(userId: string, groupId: string): Promise<boolean> {
        const membershipSnapshot = await getDocs(query(
            collection(this.firestore, 'music_group_members'),
            where('groupId', '==', groupId),
            where('userId', '==', userId)
        ));
        const batch = writeBatch(this.firestore);
        membershipSnapshot.docs.forEach((membership) => batch.delete(membership.ref));
        batch.update(doc(this.firestore, 'users', userId), { groupId: null, groupPromptDismissed: true });
        await batch.commit();
        return true;
    }

    private createCode(): string {
        return Math.random().toString(36).slice(2, 8).toUpperCase();
    }

    private handleError(error: unknown): Observable<never> {
        console.error('Music group service error:', error);
        return throwError(() => error);
    }
}
