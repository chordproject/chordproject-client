import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthService } from '../firebase/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _authenticated = false;
    private _isAuthenticatedSource = new BehaviorSubject<boolean>(
        this._authenticated
    );
    private _authService = inject(AuthService);

    constructor() {
        this._authService.user$.subscribe(async (user) => {
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
        return this._authService.user$.pipe(
            map((firebaseUser) =>
                firebaseUser
                    ? {
                          uid: firebaseUser.uid,
                          name: firebaseUser.displayName ?? '',
                          email: firebaseUser.email ?? '',
                          emailVerified: firebaseUser.emailVerified ?? false,
                          avatar: firebaseUser.photoURL ?? '',
                      }
                    : null
            )
        );
    }
}
