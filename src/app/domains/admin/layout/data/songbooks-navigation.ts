import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { SongbookService } from '@/app/core/firebase/api/songbook.service';
import { UserService } from '@/app/core/user/user.service';
import { NavigationItem } from '@/app/domains/admin/layout/data/navigation';

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
        isAuthenticated ? this.buildTree() : of(null)
      )
    );

  private buildTree(): Observable<NavigationItem[]> {
    return this.songbookService.getByParent('').pipe(
      switchMap((roots) => {
        if (roots.length === 0) {
          return of([]);
        }

        const branches = roots.map((root) =>
          this.songbookService.getByParent(root.uid).pipe(
            map((children): NavigationItem => {
              const childItems: NavigationItem[] | undefined =
                children.length > 0
                  ? children.map((child) => ({
                      id: `songbook-${child.uid}`,
                      label: child.name,
                      route: `/admin/songbook/${child.uid}`,
                    }))
                  : undefined;

              return {
                id: `songbook-${root.uid}`,
                label: root.name,
                route: childItems ? undefined : `/admin/songbook/${root.uid}`,
                children: childItems,
              };
            })
          )
        );

        return forkJoin(branches);
      })
    );
  }
}
