import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from 'app/core/firebase/auth/auth.service';
import { map, Observable } from 'rxjs';

export const NoAuthGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
    const authService = inject(AuthService);
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
