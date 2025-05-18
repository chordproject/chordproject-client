import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
    Routes,
} from '@angular/router';
import { SongService } from 'app/core/firebase/api/song.service';
import { catchError, throwError } from 'rxjs';
import { SongsDetailsComponent } from './details/details.component';
import { LibraryComponent } from './library.component';
import { SongsListComponent } from './list/list.component';

const songResolver = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const songService = inject(SongService);
    const router = inject(Router);

    return songService.get(route.paramMap.get('uid')).pipe(
        // Error here means the requested song is not available
        catchError((error) => {
            // Log the error
            console.error(error);

            // Get the parent url
            const parentUrl = state.url.split('/').slice(0, -1).join('/');

            // Navigate to there
            router.navigateByUrl(parentUrl);

            // Throw an error
            return throwError(error);
        })
    );
};

const canDeactivateSongsDetails = (
    component: SongsDetailsComponent,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    if (nextRoute.paramMap.get('uid')) {
        return true;
    }

    return component.closeDrawer().then(() => true);
};

export default [
    {
        path: '',
        component: LibraryComponent,
        resolve: {
            tags: () => inject(SongService).getTags(),
        },
        children: [
            {
                path: '',
                component: SongsListComponent,
                children: [
                    {
                        path: ':uid',
                        component: SongsDetailsComponent,
                        resolve: {
                            song: songResolver,
                        },
                        canDeactivate: [canDeactivateSongsDetails],
                    },
                ],
            },
        ],
    },
] as Routes;
