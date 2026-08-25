import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { AuthService } from '../firebase/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _authenticated = false;
    private _isAuthenticatedSource = new BehaviorSubject<boolean>(
        this._authenticated
    );
    private _authService = inject(AuthService);
    private _isAdmin$: Observable<boolean>;

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

    // Emits once Firebase has resolved the persisted session; use this before gating on isAuthenticated() to avoid a false negative on cold page loads.
    isAuthReady(): Observable<boolean> {
        return this._authService.authReady$;
    }

    isAdmin(): Observable<boolean> {
        if (!this._isAdmin$) {
            this._isAdmin$ = this._authService.user$.pipe(
                switchMap((firebaseUser) =>
                    firebaseUser ? from(firebaseUser.getIdTokenResult()).pipe(map((token) => token.claims.admin === true)) : of(false)
                ),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }

        return this._isAdmin$;
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
