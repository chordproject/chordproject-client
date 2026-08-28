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
        isAuthenticated ? this.songbookService.getPersonalGroups() : of([]),
        this.songbookService.getRecommendedGroups(),
      ]).pipe(
        map(([personalSongbooks, personalGroups, recommendedGroups]) => {
          const groupedPersonalIds = new Set(personalGroups.flatMap(({ group, songbooks }) => [group.uid, ...songbooks.map((songbook) => songbook.uid)]));
          const standalonePersonalSongbooks = personalSongbooks.filter((songbook) => !groupedPersonalIds.has(songbook.uid));
          const copiedSourceIds = new Set(
            personalSongbooks
              .filter((songbook) => songbook.deleted !== true)
              .map((songbook) => songbook.copiedFrom)
              .filter(Boolean)
          );
          return [
            ...this.toNavigationSection('songbooks-personal', 'songbook_page.my_songbooks', [
              ...this.toGroupNavigationItems(personalGroups),
              ...this.toNavigationItems(standalonePersonalSongbooks),
            ]),
            ...this.toNavigationSection('songbooks-hj', 'songbook_page.hj_songbooks', this.toGroupNavigationItems(
              recommendedGroups.filter(({ group, songbooks }) => !copiedSourceIds.has(group.uid) || songbooks.some((songbook) => !copiedSourceIds.has(songbook.uid)))
            )),
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
    children: NavigationItem[]
  ): NavigationItem[] {
    return [{
      id,
      label,
      route: children.length ? undefined : '/songbook',
      children: children.length ? children : undefined,
    }];
  }

  private toNavigationItems(songbooks: { uid: string; name: string }[]): NavigationItem[] {
    return this.sortSongbooks(songbooks).map((songbook): NavigationItem => ({
      id: `songbook-${songbook.uid}`,
      label: songbook.name,
      dynamic: true,
      route: `/songbook/${songbook.uid}`,
    }));
  }

  private toGroupNavigationItems(groups: { group: { uid: string; name: string; order?: number }; songbooks: { uid: string; name: string }[] }[]): NavigationItem[] {
    return [...groups]
      .sort((first, second) => Number(first.group.order ?? 0) - Number(second.group.order ?? 0))
      .map(({ group, songbooks }) => ({
        id: `songbook-group-${group.uid}`,
        label: group.name,
        dynamic: true,
        category: true,
        children: this.toNavigationItems(songbooks),
      }));
  }

  private sortSongbooks<T extends { name: string }>(songbooks: T[]): T[] {
    return [...songbooks].sort((first, second) => {
      return first.name.localeCompare(second.name, 'es', { sensitivity: 'base' });
    });
  }
}
