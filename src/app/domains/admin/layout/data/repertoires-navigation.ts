import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable, of } from 'rxjs';
import { RepertoireService } from '@/app/core/firebase/api/repertoire.service';
import { NavigationItem } from '@/app/domains/admin/layout/data/navigation';
import { Repertoire } from '@/app/models/repertoire';

/**
 * Builds the "Repertoires" navigation branch from Firestore data, grouping
 * repertoires by their event type.
 */
@Injectable({ providedIn: 'root' })
export class AdminRepertoiresNavigation {
  private repertoireService = inject(RepertoireService);

  readonly items$: Observable<NavigationItem[]> = combineLatest([
    this.repertoireService.getEventTypes(),
    this.repertoireService.getRepertoires(),
    this.repertoireService.getRepertoireGroups(),
  ]).pipe(
    map(([eventTypes, repertoires, repertoireGroups]) => {
      const groupedRepertoireIds = new Set(repertoireGroups.flatMap(({ repertoires }) => repertoires.map(({ uid }) => uid)));
      const byEventType = new Map<string, Repertoire[]>();
      for (const repertoire of repertoires.filter(({ uid }) => !groupedRepertoireIds.has(uid))) {
        const group = byEventType.get(repertoire.eventTypeId) ?? [];
        group.push(repertoire);
        byEventType.set(repertoire.eventTypeId, group);
      }

      const eventTypeItems = eventTypes
        .filter((eventType) => byEventType.has(eventType.uid))
        .map((eventType): NavigationItem => ({
          id: `repertoire-group-${eventType.uid}`,
          label: eventType.name,
          dynamic: true,
          category: true,
          children: (byEventType.get(eventType.uid) ?? []).map((repertoire) => this.toNavigationItem(repertoire)),
        }));
      const customGroupItems = repertoireGroups
        .filter(({ repertoires }) => repertoires.length > 0)
        .map(({ group, repertoires }): NavigationItem => ({
            id: `repertoire-group-${group.uid}`,
            label: group.name,
            dynamic: true,
            category: true,
            children: repertoires.map((repertoire) => this.toNavigationItem(repertoire)),
        }));

      return [...customGroupItems, ...eventTypeItems];
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
}
