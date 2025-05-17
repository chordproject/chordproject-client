import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    Auth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User,
} from 'firebase/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { FirebaseService } from '../firebase.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _auth: Auth;
    private _snackBar: MatSnackBar;
    private _user = new BehaviorSubject<User>(null);
    private _authenticated = new BehaviorSubject<boolean>(false);

    constructor() {
        const firebase = inject(FirebaseService);
        this._auth = firebase.auth;
        this._snackBar = inject(MatSnackBar);

        onAuthStateChanged(this._auth, (user) => {
            if (user) {
                this._user.next(user);
                this._authenticated.next(true);
            } else {
                this._user.next(null);
                this._authenticated.next(false);
            }
        });
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

    private showSnackbar(message: string, duration: number = 3000): void {
        this._snackBar.open(message, 'Close', {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }
}
