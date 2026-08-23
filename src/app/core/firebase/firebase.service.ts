import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
    private _firestore: Firestore;
    private _auth: Auth;

    constructor() {
        const app = initializeApp(environment.firebase);
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
