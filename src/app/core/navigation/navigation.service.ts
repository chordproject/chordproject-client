import { Injectable } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, of, ReplaySubject, tap } from 'rxjs';

const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Inicio',
        tooltip: 'Inicio',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/home',
    },
    {
        id: 'library',
        title: 'Libreria',
        tooltip: 'Libreria',
        type: 'basic',
        icon: 'heroicons_outline:musical-note',
        link: '/library',
    },
    {
        id: 'editor',
        title: 'Editor',
        tooltip: 'Editor',
        type: 'basic',
        icon: 'heroicons_outline:code-bracket',
        link: '/editor',
    },
    {
        id: 'songbooks',
        title: 'Cancioneros',
        tooltip: 'Cancioneros',
        type: 'aside',
        icon: 'heroicons_outline:book-open',
        children: [],
    },
];

const navigation: Navigation = {
    default: defaultNavigation,
};

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    get(): Observable<Navigation> {
        return of(navigation).pipe(
            tap((navigation) => {
                this._navigation.next(navigation);
            })
        );
    }
}
