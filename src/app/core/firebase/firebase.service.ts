import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, Firestore, getDocs, getFirestore, limit, query } from 'firebase/firestore';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
    private _firestore: Firestore;
    private _auth: Auth;

    constructor() {
        const app = initializeApp(environment.firebase);
        this._firestore = getFirestore(app);
        this._auth = getAuth(app);
        this.warmUpConnection();
    }

    get firestore(): Firestore {
        return this._firestore;
    }

    get auth(): Auth {
        return this._auth;
    }

    /**
     * After the app sits idle for a while (a background tab overnight, an expired auth
     * token), the FIRST Firestore read of a new session pays for a fresh network channel
     * handshake and, if signed in, a token refresh - both invisible until a user actually
     * navigates and waits on it. Kicking off a trivial read as soon as the app boots moves
     * that cost earlier, overlapping it with the time the user spends on the first screen.
     */
    private warmUpConnection(): void {
        // `currentUser` is null until auth state restoration finishes, so wait for the
        // first emission (once) instead of reading it synchronously right after `getAuth`.
        const unsubscribe = onAuthStateChanged(this._auth, (user) => {
            unsubscribe();
            user?.getIdToken().catch(() => {});
        });
        getDocs(query(collection(this._firestore, 'event_types'), limit(1))).catch(() => {});
    }
}
