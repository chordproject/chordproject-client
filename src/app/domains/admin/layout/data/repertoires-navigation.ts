import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { RepertoireService } from '@/app/core/firebase/api/repertoire.service';
import { UserService } from '@/app/core/user/user.service';
import { NavigationItem } from '@/app/domains/admin/layout/data/navigation';
import { Repertoire } from '@/app/models/repertoire';

/**
 * Builds the "Repertoires" navigation branch from Firestore data, grouping
 * repertoires by their event type.
 */
@Injectable({ providedIn: 'root' })
export class AdminRepertoiresNavigation {
  private userService = inject(UserService);
  private repertoireService = inject(RepertoireService);

  readonly items$: Observable<NavigationItem[]> = combineLatest([
    this.userService.user$,
    this.repertoireService.getRepertoires(),
    this.repertoireService.getRepertoireGroups(),
  ]).pipe(
    map(([user, repertoires, repertoireGroups]) => {
      const personalRepertoires = repertoires.filter((repertoire) =>
        Boolean(user?.uid)
        && (repertoire.authorId === user.uid || repertoire.ownerId === user.uid)
        && !this.repertoireService.isSharedRepertoire(repertoire)
      );
      const personalIds = new Set(personalRepertoires.map(({ uid }) => uid));
      const publicRepertoires = repertoires.filter((repertoire) => this.repertoireService.isSharedRepertoire(repertoire));
      const groupedRepertoireIds = new Set(
        repertoireGroups.flatMap(({ repertoires: grouped }) => grouped.map(({ uid }) => uid))
      );
      const otherPersonalItems = this.toOtherNavigationItem(
        'repertoires-other-personal',
        personalRepertoires.filter(({ uid }) => !groupedRepertoireIds.has(uid))
      );
      const customGroupItems = repertoireGroups
        .filter(({ repertoires }) => repertoires.length > 0)
        .map(({ group, repertoires }) => ({ group, repertoires: repertoires.filter(({ uid }) => personalIds.has(uid)) }))
        .filter(({ repertoires }) => repertoires.length > 0)
        .map(({ group, repertoires }): NavigationItem => ({
            id: `repertoire-group-${group.uid}`,
            label: group.name,
            dynamic: true,
            category: true,
            children: repertoires.map((repertoire) => this.toNavigationItem(repertoire)),
        }));
      const publicGroupedRepertoireIds = new Set(
        repertoireGroups.flatMap(({ repertoires: grouped }) =>
          grouped.filter((repertoire) => publicRepertoires.some(({ uid }) => uid === repertoire.uid)).map(({ uid }) => uid)
        )
      );
      const publicGroupItems = repertoireGroups
        .map(({ group, repertoires }) => ({
          group,
          repertoires: repertoires.filter((repertoire) => publicRepertoires.some(({ uid }) => uid === repertoire.uid)),
        }))
        .filter(({ repertoires }) => repertoires.length > 0)
        .map(({ group, repertoires }): NavigationItem => ({
          id: `repertoire-public-group-${group.uid}`,
          label: group.name,
          dynamic: true,
          category: true,
          children: repertoires.map((repertoire) => this.toNavigationItem(repertoire)),
        }));
      const otherPublicItems = this.toOtherNavigationItem(
        'repertoires-other-public',
        publicRepertoires.filter(({ uid }) => !publicGroupedRepertoireIds.has(uid))
      );

      return [
        ...this.toNavigationSection(
          'repertoires-personal',
          'repertoire_page.my_repertoires',
          [...customGroupItems, ...otherPersonalItems]
        ),
        ...this.toNavigationSection(
          'repertoires-public',
          'repertoire_page.public_repertoires',
          [
            ...publicGroupItems,
            ...otherPublicItems,
          ]
        ),
      ];
    }),
    catchError((error) => {
      console.error('Failed to load repertoires navigation:', error);
      return of([]);
    })
  );

  private toNavigationItem(repertoire: Repertoire): NavigationItem {
    return {
      id: `repertoire-${repertoire.uid}`,
      label: repertoire.title,
      dynamic: true,
      route: `/repertoires/${repertoire.uid}/live`,
    };
  }

  private toNavigationSection(id: string, label: string, children: NavigationItem[]): NavigationItem[] {
    return [{
      id,
      label,
      route: children.length ? undefined : '/repertoires',
      children: children.length ? children : undefined,
    }];
  }

  private toOtherNavigationItem(id: string, repertoires: Repertoire[]): NavigationItem[] {
    return repertoires.length
      ? [{
          id,
          label: 'Otros',
          dynamic: true,
          category: true,
          children: repertoires.map((repertoire) => this.toNavigationItem(repertoire)),
        }]
      : [];
  }

}
