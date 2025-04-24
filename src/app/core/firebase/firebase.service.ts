import { Injectable, inject } from '@angular/core';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
    private _firestore: Firestore;
    private _auth: Auth;

    constructor() {
        const app = inject(FirebaseApp);
        this._firestore = getFirestore(app);
        this._auth = getAuth(app);
    }

    get firestore(): Firestore {
        return this._firestore;
    }

    get auth(): Auth {
        return this._auth;
    }
}
