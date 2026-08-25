import { Tree, TreeItem, TreeItemGroup } from '@angular/aria/tree';
import { CdkMonitorFocus } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import {
  isActive,
  IsActiveMatchOptions,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { filter, take } from 'rxjs';
import { UserService } from '@/app/core/user/user.service';
import {
  NAVIGATION,
  NavigationItem,
} from '@/app/domains/admin/layout/data/navigation';
import { AdminSongbooksNavigation } from '@/app/domains/admin/layout/data/songbooks-navigation';

@Component({
  selector: 'navigation',
  imports: [
    MatIcon,
    NgTemplateOutlet,
    RouterLinkActive,
    Tree,
    TreeItem,
    TreeItemGroup,
    RouterLink,
    CdkMonitorFocus,
    TranslocoModule,
  ],
  template: `
    <div class="flex flex-col gap-y-4">
      @for (section of visibleNavigation(); track section.id) {
        @if (section.children && section.children.length > 0) {
          <div class="flex flex-col px-4">
            <!-- Section content -->
            <ul
            ngTree
            class="mt-1 flex flex-col gap-y-1"
            [nav]="true"
            #tree="ngTree"
          >
            <ng-template
              [ngTemplateOutlet]="treeNodes"
              [ngTemplateOutletContext]="{
                nodes: section.children,
                parent: tree,
              }"
            />
          </ul>

          <!-- Menu item -->
          <ng-template
            let-nodes="nodes"
            let-parent="parent"
            #treeNodes
          >
            @for (node of nodes; track node.id) {
              <a
                cdkMonitorElementFocus
                ngTreeItem
                routerLinkActive="bg-neutral-700/10 dark:bg-neutral-300/10"
                class="navigation-item flex cursor-pointer items-center gap-x-2 rounded-lg px-2.5 py-2 select-none hover:bg-neutral-700/10 dark:hover:bg-neutral-300/10"
                [parent]="parent"
                [value]="node.id"
                [label]="node.dynamic ? node.label : (node.label | transloco)"
                [disabled]="node.disabled"
                [selectable]="!node.children"
                [(expanded)]="node.expanded"
                [routerLink]="node.route"
                [routerLinkActiveOptions]="
                  node.activeOptions ?? { exact: true }
                "
                (click)="onNavigationClick($event, node)"
                #rla="routerLinkActive"
                #treeItem="ngTreeItem"
              >
                <!-- Icon -->
                @if (node.icon) {
                  <mat-icon
                    class="pointer-events-none size-4"
                    [svgIcon]="node.icon"
                  />
                }

                <!-- Label -->
                <div
                  class="flex flex-auto flex-col"
                  [class.font-semibold]="node.children && node.children.length > 0"
                  [class.font-medium]="!node.children || node.children.length === 0"
                  [class.text-primary-600]="node.category"
                  [class.dark:text-primary-400]="node.category"
                >
                  {{ node.dynamic ? node.label : (node.label | transloco) }}

                  <!-- Description -->
                  @if (node.description) {
                    <div class="text-xs">
                      {{ node.description }}
                    </div>
                  }
                </div>

                <!-- Badge -->
                @if (node.badge) {
                  <div
                    class="rounded border border-neutral-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
                  >
                    {{ node.badge }}
                  </div>
                }

                <!-- Expand icon -->
                @if (node.children && node.children.length > 0) {
                  <mat-icon
                    svgIcon="chevron-right"
                    class="pointer-events-none size-4 transition-[rotate]"
                    [class.rotate-90]="node.expanded"
                  />
                }
              </a>

              <!-- Children -->
              @if (node.children && node.children.length > 0) {
                <ul
                  class="flex flex-col gap-y-1 [&_ul>.navigation-item]:pl-14.5 [&>.navigation-item]:pl-10"
                  [class.hidden]="!node.expanded"
                  [class.mt-1.5]="node.expanded"
                  role="group"
                >
                  <ng-template
                    ngTreeItemGroup
                    [ownedBy]="treeItem"
                    #group="ngTreeItemGroup"
                  >
                    <ng-template
                      [ngTemplateOutlet]="treeNodes"
                      [ngTemplateOutletContext]="{
                        nodes: node.children,
                        parent: group,
                      }"
                    />
                  </ng-template>
                </ul>
              }
            }
          </ng-template>
        </div>
        }
      }
    </div>
  `,
})
export class Navigation {
  // Dependencies
  private router = inject(Router);
  private songbooksNavigation = inject(AdminSongbooksNavigation);
  private userService = inject(UserService);

  // State
  protected navigation = signal<NavigationItem[]>(NAVIGATION);
  protected isAuthenticated = toSignal(this.userService.isAuthenticated(), {
    initialValue: false,
  });
  protected visibleNavigation = computed(() =>
    this.filterByAuth(this.navigation(), this.isAuthenticated())
  );
  protected navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      take(1)
    )
  );
  protected songbooks = toSignal(this.songbooksNavigation.items$, {
    initialValue: null,
  });

  constructor() {
    // Replace the static "Songbooks" entry with the signed-in user's songbooks
    effect(() => {
      const songbooks = this.songbooks();
      this.navigation.update((items) => this.withSongbooks(items, songbooks));
    });

    // Expand active route on initial load
    effect(() => {
      const navigationEnd = this.navigationEnd();
      if (!navigationEnd) {
        return;
      }

      this.navigation.set(this.expandActiveRoute(this.navigation()));
    });
  }

  /**
   * Replace the static "Songbooks" entry's route with a dynamic tree of the
   * signed-in user's songbooks.
   */
  private withSongbooks(
    items: NavigationItem[],
    songbooks: NavigationItem[] | null
  ): NavigationItem[] {
    return items.map((section) => ({
      ...section,
      children: section.children?.map((item) =>
        item.id === 'general/songbooks'
          ? this.withSongbooksItem(item, songbooks)
          : item
      ),
    }));
  }

  /**
   * Keep Songbooks clickable even when dynamic data is unavailable.
   */
  private withSongbooksItem(
    item: NavigationItem,
    songbooks: NavigationItem[] | null
  ): NavigationItem {
    if (!songbooks || songbooks.length === 0) {
      return { ...item, route: '/songbook', children: undefined };
    }

    return {
      ...item,
      route: '/songbook',
      children: songbooks,
    };
  }

  /**
   * Hide items (and their children) that require an authenticated user.
   */
  private filterByAuth(
    items: NavigationItem[],
    isAuthenticated: boolean
  ): NavigationItem[] {
    return items
      .map((item) => ({
        ...item,
        children: item.children
          ? this.filterByAuth(item.children, isAuthenticated)
          : item.children,
      }))
      .filter((item) => !item.requiresAuth || isAuthenticated);
  }

  private firstRoute(items: NavigationItem[]): string | undefined {
    for (const item of items) {
      if (item.route) {
        return item.route;
      }

      if (item.children?.length) {
        const childRoute = this.firstRoute(item.children);
        if (childRoute) {
          return childRoute;
        }
      }

    }

    return undefined;
  }

  onNavigationClick(event: MouseEvent, item: NavigationItem): void {
    event.preventDefault();

    if (item.route) {
      this.router.navigateByUrl(item.route);
    }
  }

  /**
   * Expand all parent routes of the active route.
   * @param items
   */
  expandActiveRoute(items: NavigationItem[]): NavigationItem[] {
    for (const item of items) {
      if (item.children?.length) {
        item.children = this.expandActiveRoute(item.children);

        if (item.children.some((child) => child.expanded)) {
          item.expanded = true;
        }
      }

      if (
        item.route &&
        isActive(
          item.route,
          this.router,
          this.isActiveOption(item.activeOptions ?? { exact: true })
        )()
      ) {
        item.expanded = true;
      }
    }
    return items;
  }

  /**
   * Convert simple exact option to full IsActiveMatchOptions.
   * @param options
   */
  isActiveOption(
    options: { exact: boolean } | IsActiveMatchOptions
  ): IsActiveMatchOptions {
    if ('exact' in options) {
      return options.exact
        ? {
            paths: 'exact',
            queryParams: 'exact',
            fragment: 'ignored',
            matrixParams: 'ignored',
          }
        : {
            paths: 'subset',
            queryParams: 'subset',
            fragment: 'ignored',
            matrixParams: 'ignored',
          };
    }

    return options;
  }
}
