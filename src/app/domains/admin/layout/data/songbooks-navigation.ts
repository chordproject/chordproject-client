import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { SongbookService } from '@/app/core/firebase/api/songbook.service';
import { UserService } from '@/app/core/user/user.service';
import { NavigationItem } from '@/app/domains/admin/layout/data/navigation';
import { environment } from 'environments/environment';

/**
 * Builds the "Songbooks" navigation branch from Firestore data.
 * Emits `null` while signed out so the caller can fall back to the static entry.
 */
@Injectable({ providedIn: 'root' })
export class AdminSongbooksNavigation {
  private userService = inject(UserService);
  private songbookService = inject(SongbookService);

  readonly items$: Observable<NavigationItem[] | null> = this.userService
    .isAuthenticated()
    .pipe(
      switchMap((isAuthenticated) =>
        isAuthenticated || environment.brand === 'hj'
          ? this.buildTree(isAuthenticated).pipe(
              catchError((error) => {
                console.error('Failed to load songbooks navigation:', error);
                return of([]);
              })
            )
          : of(null)
      )
    );

  private buildTree(isAuthenticated: boolean): Observable<NavigationItem[]> {
    if (environment.brand === 'hj') {
      return combineLatest([
        isAuthenticated ? this.songbookService.getPersonal() : of([]),
        this.songbookService.getRecommended(),
      ]).pipe(
        map(([personalSongbooks, recommendedSongbooks]) => {
          const copiedSourceIds = new Set(
            personalSongbooks
              .filter((songbook) => songbook.deleted !== true)
              .map((songbook) => songbook.copiedFrom)
              .filter(Boolean)
          );
          const availableRecommendedSongbooks = this.filterCopiedRecommendedSongbooks(recommendedSongbooks, copiedSourceIds);

          return [
            ...this.toNavigationSection('songbooks-personal', 'Mis cancioneros', personalSongbooks),
            ...this.toNavigationSection('songbooks-hj', 'HomenaJesus', availableRecommendedSongbooks),
          ];
        })
      );
    }

    return this.songbookService.getPersonal().pipe(
      map((songbooks) => this.toNavigationItems(songbooks))
    );
  }

  private toNavigationSection(
    id: string,
    label: string,
    songbooks: { uid: string; name: string; parent?: string; order?: string }[]
  ): NavigationItem[] {
    const children = this.toNavigationItems(songbooks);

    return [{
      id,
      label,
      dynamic: true,
      route: children.length ? undefined : '/songbook',
      children: children.length ? children : undefined,
    }];
  }

  private toNavigationItems(songbooks: { uid: string; name: string; parent?: string; order?: string }[]): NavigationItem[] {
    const roots = this.sortSongbooks(songbooks.filter((songbook) => !songbook.parent));

    return roots.map((root): NavigationItem => {
      const children = this.sortSongbooks(songbooks.filter((songbook) => songbook.parent === root.uid))
        .map((child): NavigationItem => ({
          id: `songbook-${child.uid}`,
          label: child.name,
          dynamic: true,
          route: `/songbook/${child.uid}`,
        }));

      return {
        id: `songbook-${root.uid}`,
        label: root.name,
        dynamic: true,
        category: children.length > 0,
        route: children.length ? undefined : `/songbook/${root.uid}`,
        children: children.length ? children : undefined,
      };
    });
  }

  private sortSongbooks<T extends { name: string; order?: string }>(songbooks: T[]): T[] {
    return [...songbooks].sort((first, second) => {
      const firstOrder = Number(first.order ?? 0);
      const secondOrder = Number(second.order ?? 0);

      return firstOrder - secondOrder || first.name.localeCompare(second.name, 'es', { sensitivity: 'base' });
    });
  }

  private filterCopiedRecommendedSongbooks<T extends { uid: string; parent?: string }>(songbooks: T[], copiedSourceIds: Set<string>): T[] {
    return songbooks
      .map((songbook) => ({
        songbook,
        children: songbooks.filter((child) => child.parent === songbook.uid),
      }))
      .filter(({ songbook, children }) => !copiedSourceIds.has(songbook.uid) || children.some((child) => !copiedSourceIds.has(child.uid)))
      .map(({ songbook }) => songbook)
      .filter((songbook) => !songbook.parent || !copiedSourceIds.has(songbook.uid));
  }
}
