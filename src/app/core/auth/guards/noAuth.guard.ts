import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { FirebaseAuthService } from 'app/core/firebase/auth/firebase-auth.service';
import { map, Observable } from 'rxjs';

export const NoAuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
    const authService = inject(FirebaseAuthService);
    const router = inject(Router);

    return authService.authenticated$.pipe(
        map((authenticated) => {
            if (authenticated) {
                return router.parseUrl('/home');
            }
            return true;
        })
    );
};
