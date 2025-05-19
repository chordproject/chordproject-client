import { inject, Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SongbookService } from '../firebase/api/songbook.service';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _navigation: ReplaySubject<FuseNavigationItem[]> =
        new ReplaySubject<FuseNavigationItem[]>(1);
    private _userService = inject(UserService);
    private _songbookService = inject(SongbookService);

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
        this._userService
            .isAuthenticated()
            .pipe(
                switchMap((isAuthenticated) =>
                    isAuthenticated
                        ? this.buildSongbooksNavigation()
                        : this.buildBasicNavigation()
                )
            )
            .subscribe((navigation) => this._navigation.next(navigation));
    }

    private buildBasicNavigation(): Observable<FuseNavigationItem[]> {
        return of([...this.baseNavigation, this.unauthenticatedSongbooks]);
    }

    private buildSongbooksNavigation(): Observable<FuseNavigationItem[]> {
        return this._songbookService.getByParent('').pipe(
            switchMap((rootSongbooks) => {
                const childrenQueries = rootSongbooks.map((songbook) =>
                    this._songbookService.getByParent(songbook.uid).pipe(
                        map(
                            (childSongbooks) =>
                                ({
                                    id: `songbook-${songbook.uid}`,
                                    title: songbook.name,
                                    type: 'collapsable' as const,
                                    children: childSongbooks.map((child) => ({
                                        id: `songbook-${child.uid}`,
                                        title: child.name,
                                        type: 'basic' as const,
                                        link: `/songbook/${child.uid}`,
                                    })),
                                }) as FuseNavigationItem
                        )
                    )
                );

                return forkJoin(childrenQueries);
            }),
            map((songbookItems) => [
                ...this.baseNavigation,
                {
                    ...this.authenticatedSongbooks,
                    children: songbookItems,
                },
            ])
        );
    }

    get navigation$(): Observable<FuseNavigationItem[]> {
        return this._navigation.asObservable();
    }

    get(): Observable<FuseNavigationItem[]> {
        return this._navigation.asObservable();
    }
}
