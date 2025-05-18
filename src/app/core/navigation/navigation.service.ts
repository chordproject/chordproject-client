import { inject, Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Observable, ReplaySubject } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _navigation: ReplaySubject<FuseNavigationItem[]> =
        new ReplaySubject<FuseNavigationItem[]>(1);
    private _userService = inject(UserService);

    private readonly baseNavigation: FuseNavigationItem[] = [
        {
            id: 'home',
            title: 'Home',
            tooltip: 'Home',
            type: 'basic',
            icon: 'heroicons_outline:home',
            link: '/home',
        },
        {
            id: 'library',
            title: 'Library',
            tooltip: 'Library',
            type: 'basic',
            icon: 'heroicons_outline:musical-note',
            link: '/library',
        },
        {
            id: 'create',
            title: 'Create',
            tooltip: 'Create',
            type: 'basic',
            icon: 'heroicons_outline:code-bracket',
            link: '/songs/create',
        },
    ];

    private readonly authenticatedSongbooks: FuseNavigationItem = {
        id: 'songbooks',
        title: 'Songbooks',
        tooltip: 'Songbooks',
        type: 'aside',
        icon: 'heroicons_outline:book-open',
        children: [],
    };

    private readonly unauthenticatedSongbooks: FuseNavigationItem = {
        id: 'songbooks-signin',
        title: 'Songbooks',
        tooltip: 'Songbooks',
        type: 'basic',
        icon: 'heroicons_outline:book-open',
        link: '/sign-in',
    };

    constructor() {
        this._userService.isAuthenticated().subscribe((isAuthenticated) => {
            const navigation = [
                ...this.baseNavigation,
                isAuthenticated
                    ? this.authenticatedSongbooks
                    : this.unauthenticatedSongbooks,
            ];
            this._navigation.next(navigation);
        });
    }

    get navigation$(): Observable<FuseNavigationItem[]> {
        return this._navigation.asObservable();
    }

    get(): Observable<FuseNavigationItem[]> {
        return this._navigation.asObservable();
    }
}
