import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import {
    Auth,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User,
} from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { FirebaseService } from '../firebase.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _auth: Auth;
    private _snackBar: MatSnackBar;
    private _router: Router;
    private _translocoService: TranslocoService;
    private _user = new BehaviorSubject<User>(null);
    private _authenticated = new BehaviorSubject<boolean>(false);
    private _authReady = new BehaviorSubject<boolean>(false);

    constructor() {
        const firebase = inject(FirebaseService);
        this._auth = firebase.auth;
        this._snackBar = inject(MatSnackBar);
        this._router = inject(Router);
        this._translocoService = inject(TranslocoService);

        onAuthStateChanged(this._auth, (user) => {
            if (user) {
                this._user.next(user);
                this._authenticated.next(true);
            } else {
                this._user.next(null);
                this._authenticated.next(false);
            }
            this._authReady.next(true);
        });
    }

    // Emits true once Firebase has resolved the persisted session (or confirmed there isn't one).
    get authReady$(): Observable<boolean> {
        return this._authReady.asObservable();
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    get authenticated$(): Observable<boolean> {
        return this._authenticated.asObservable();
    }

    signInWithEmail(email: string, password: string): Observable<User> {
        return from(
            signInWithEmailAndPassword(this._auth, email, password)
                .then((result) => {
                    return result.user;
                })
                .catch((error) => {
                    this.showSnackbar(`Sign in failed: ${error.message}`);
                    throw error;
                })
        );
    }

    signInWithGoogle(): Observable<User> {
        const provider = new GoogleAuthProvider();
        return from(
            signInWithPopup(this._auth, provider)
                .then((result) => {
                    return result.user;
                })
                .catch((error) => {
                    this.showSnackbar(
                        `Google sign in failed: ${error.message}`
                    );
                    throw error;
                })
        );
    }

    signInWithGithub(): Observable<User> {
        const provider = new GithubAuthProvider();
        return from(
            signInWithPopup(this._auth, provider)
                .then((result) => {
                    return result.user;
                })
                .catch((error) => {
                    this.showSnackbar(
                        `GitHub sign in failed: ${error.message}`
                    );
                    throw error;
                })
        );
    }

    createUser(email: string, password: string): Observable<User> {
        return from(
            createUserWithEmailAndPassword(this._auth, email, password)
                .then((result) => {
                    return result.user;
                })
                .catch((error) => {
                    this.showSnackbar(`Registration failed: ${error.message}`);
                    throw error;
                })
        );
    }

    forgotPassword(email: string): Observable<void> {
        return from(
            sendPasswordResetEmail(this._auth, email)
                .then(() => {
                    this.showSnackbar('Password reset email sent');
                })
                .catch((error) => {
                    this.showSnackbar(
                        `Failed to send reset email: ${error.message}`
                    );
                    throw error;
                })
        );
    }

    confirmPasswordReset(oobCode: string, password: string): Promise<void> {
        return confirmPasswordReset(this._auth, oobCode, password).catch((error) => {
            this.showSnackbar(`Password reset failed: ${error.message}`);
            throw error;
        });
    }

    signOut(): Observable<void> {
        return from(
            signOut(this._auth)
                .then(() => {})
                .catch((error) => {
                    this.showSnackbar(`Sign out failed: ${error.message}`);
                    throw error;
                })
        );
    }

    private showSnackbar(message: string, duration = 3000): void {
        this._snackBar.open(message, 'Close', {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }

    /** Shows an actionable "authentication required" snackbar; its action navigates to sign-in and returns to `returnUrl` (defaults to the current page) once signed in. */
    promptSignIn(returnUrl?: string): void {
        const targetUrl = returnUrl ?? this._router.url;
        this._translocoService
            .selectTranslate('common.authentication_required')
            .pipe(
                switchMap((message) =>
                    this._translocoService
                        .selectTranslate('nav.sign_in')
                        .pipe(map((signInLabel) => ({ message, signInLabel })))
                ),
                take(1)
            )
            .subscribe(({ message, signInLabel }) => {
                const snackBarRef = this._snackBar.open(message, signInLabel, {
                    duration: 6000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    panelClass: ['warning'],
                });
                snackBarRef.onAction().subscribe(() => {
                    this._router.navigate(['/auth/sign-in'], { queryParams: { returnUrl: targetUrl } });
                });
            });
    }
}
