import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { UserService } from 'app/core/user/user.service';

// Blocks unauthenticated access to routes that require a signed-in user, redirecting to sign-in instead.
export const authGuard: CanActivateFn = () => {
    const userService = inject(UserService);
    const router = inject(Router);

    // Wait for Firebase to resolve the persisted session first, otherwise a cold page load
    // reads isAuthenticated()'s initial "false" value before the real auth state arrives.
    return userService.isAuthReady().pipe(
        filter(Boolean),
        take(1),
        switchMap(() => userService.isAuthenticated().pipe(take(1))),
        map((isAuthenticated) => isAuthenticated || router.parseUrl('/auth/sign-in'))
    );
};
