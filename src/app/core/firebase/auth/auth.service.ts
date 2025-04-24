import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { 
    Auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { FirebaseService } from '../firebase.service';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService {
    private _auth: Auth;
    private _snackBar: MatSnackBar;
    private _router: Router;
    private _user = new BehaviorSubject<User>(null);
    private _authenticated = new BehaviorSubject<boolean>(false);

    constructor() {
        const firebase = inject(FirebaseService);
        this._auth = firebase.auth;
        this._snackBar = inject(MatSnackBar);
        this._router = inject(Router);

        // Monitor auth state changes
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

    /**
     * Get current user
     */
    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    /**
     * Get authentication status
     */
    get authenticated$(): Observable<boolean> {
        return this._authenticated.asObservable();
    }

    /**
     * Sign in with email and password
     */
    signInWithEmail(email: string, password: string): Observable<User> {
        return from(signInWithEmailAndPassword(this._auth, email, password)
            .then(result => {
                this.showSnackbar('Signed in successfully');
                return result.user;
            })
            .catch(error => {
                this.showSnackbar(`Sign in failed: ${error.message}`);
                throw error;
            })
        );
    }

    /**
     * Sign in with Google
     */
    signInWithGoogle(): Observable<User> {
        const provider = new GoogleAuthProvider();
        return from(signInWithPopup(this._auth, provider)
            .then(result => {
                this.showSnackbar('Signed in with Google successfully');
                return result.user;
            })
            .catch(error => {
                this.showSnackbar(`Google sign in failed: ${error.message}`);
                throw error;
            })
        );
    }

    /**
     * Create user with email and password
     */
    createUser(email: string, password: string): Observable<User> {
        return from(createUserWithEmailAndPassword(this._auth, email, password)
            .then(result => {
                this.showSnackbar('Account created successfully');
                return result.user;
            })
            .catch(error => {
                this.showSnackbar(`Registration failed: ${error.message}`);
                throw error;
            })
        );
    }

    /**
     * Send password reset email
     */
    forgotPassword(email: string): Observable<void> {
        return from(sendPasswordResetEmail(this._auth, email)
            .then(() => {
                this.showSnackbar('Password reset email sent');
            })
            .catch(error => {
                this.showSnackbar(`Failed to send reset email: ${error.message}`);
                throw error;
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<void> {
        return from(signOut(this._auth)
            .then(() => {
                this.showSnackbar('Signed out successfully');
                this._router.navigate(['/sign-in']);
            })
            .catch(error => {
                this.showSnackbar(`Sign out failed: ${error.message}`);
                throw error;
            })
        );
    }

    /**
     * Show snackbar message
     */
    private showSnackbar(message: string, duration: number = 3000): void {
        this._snackBar.open(message, 'Close', {
            duration: duration,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
        });
    }
}
