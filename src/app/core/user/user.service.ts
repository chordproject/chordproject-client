import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FirebaseAuthService } from '../firebase/auth/firebase-auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _authenticated = false;
    private _isAuthenticatedSource = new BehaviorSubject<boolean>(
        this._authenticated
    );
    private _firebaseAuthService = inject(FirebaseAuthService);

    constructor() {
        this._firebaseAuthService.user$.subscribe(async (user) => {
            if (user) {
                this._authenticated = true;
            } else {
                this._authenticated = false;
            }
            this._isAuthenticatedSource.next(this._authenticated);
        });
    }

    isAuthenticated(): Observable<boolean> {
        return this._isAuthenticatedSource.asObservable();
    }

    get user$(): Observable<User> {
        return this._firebaseAuthService.user$.pipe(
            map((firebaseUser) =>
                firebaseUser
                    ? {
                          id: firebaseUser.uid,
                          name: firebaseUser.displayName ?? '',
                          email: firebaseUser.email ?? '',
                          // add other fields as needed
                      }
                    : null
            )
        );
    }
}
