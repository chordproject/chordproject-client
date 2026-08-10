import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { DatePipe, I18nPluralPipe, NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { Media } from '@/app/core/media';
import { Card } from '@/app/domains/admin/modules/apps/scrumboard/data/model';
import { ScrumboardService } from '@/app/domains/admin/modules/apps/scrumboard/data/scrumboard';

@Component({
  selector: 'scrumboard',
  imports: [
    CdkDrag,
    CdkDragPlaceholder,
    CdkDropList,
    CdkDropListGroup,
    DatePipe,
    I18nPluralPipe,
    NgClass,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatDivider,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatInput,
    MatPrefix,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatTooltip,
    RouterLink,
    RouterOutlet,
  ],
  host: {
    class: 'lg:h-full',
  },
  template: `
    <div
      class="@container mx-auto flex h-full w-full flex-auto flex-col overflow-hidden"
    >
      <mat-sidenav-container
        class="h-full flex-auto [&_.mat-drawer-backdrop]:fixed"
        (backdropClick)="closeCard()"
      >
        <!-- Drawer -->
        <mat-sidenav
          class="w-full border-none bg-white sm:w-lg dark:bg-neutral-900"
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="!!selectedCard()"
          [position]="'end'"
          [fixedInViewport]="isMobile()"
          disableClose
        >
          <router-outlet></router-outlet>
        </mat-sidenav>

        <mat-sidenav-content
          class="flex flex-auto flex-col"
          [class.border-r]="!!selectedCard()"
        >
          <!-- Header -->
          <div
            class="flex flex-wrap items-center gap-4 border-b px-6 py-4 lg:px-8 lg:py-8"
          >
            <div class="flex flex-col gap-y-0.5">
              <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
                Scrumboard
              </div>
              <div class="text-neutral-500">
                {{
                  data.cards.length
                    | i18nPlural
                      : {
                          '=0': 'No cards',
                          '=1': '1 card',
                          other: '# cards',
                        }
                }}
              </div>
            </div>

            <!-- Spacer -->
            <div class="flex-auto"></div>

            <!-- Assignees -->
            <div class="hidden items-center -space-x-2 @4xl:flex">
              @for (avatar of avatars; track avatar) {
                <img
                  class="size-8 shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-neutral-900"
                  [src]="avatar"
                  alt="Assignee avatar"
                />
              }
            </div>

            <!-- Search -->
            <mat-form-field class="order-last w-full @2xl:order-none @2xl:w-64">
              <mat-icon
                matPrefix
                svgIcon="search"
              />
              <input
                placeholder="Search cards"
                matInput
              />
            </mat-form-field>

            <!-- View toggle -->
            <mat-button-toggle-group
              hideSingleSelectionIndicator
              [value]="view()"
              (valueChange)="view.set($event)"
            >
              <mat-button-toggle
                [value]="'board'"
                [matTooltip]="'Board view'"
              >
                <mat-icon svgIcon="layout-grid" />
              </mat-button-toggle>
              <mat-button-toggle
                [value]="'list'"
                [matTooltip]="'List view'"
              >
                <mat-icon svgIcon="list" />
              </mat-button-toggle>
            </mat-button-toggle-group>

            <!-- Actions -->
            <button matButton="filled">
              <mat-icon svgIcon="plus" />
              Add
            </button>
          </div>

          <!-- Board -->
          @if (view() === 'board') {
            <div
              class="flex flex-auto gap-x-4 overflow-x-auto px-6 py-6 lg:px-8"
              cdkDropListGroup
            >
              @for (lane of board(); track lane.id) {
                <!-- Lane -->
                <div class="flex w-80 shrink-0 flex-col">
                  <!-- Lane header -->
                  <div class="flex items-center gap-x-2 px-1 pb-3">
                    <div class="font-semibold tracking-tight">
                      {{ lane.label }}
                    </div>
                    <div
                      class="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 tabular-nums dark:bg-black/20"
                    >
                      {{ lane.cards.length }}
                    </div>

                    <!-- Spacer -->
                    <div class="flex-auto"></div>

                    <button
                      class="text-neutral-500"
                      matIconButton
                      [matMenuTriggerFor]="laneMenu"
                    >
                      <mat-icon svgIcon="ellipsis" />
                    </button>
                    <mat-menu
                      xPosition="before"
                      #laneMenu="matMenu"
                    >
                      <button mat-menu-item>
                        <mat-icon svgIcon="pencil" />
                        Rename
                      </button>
                      <button mat-menu-item>
                        <mat-icon svgIcon="gauge" />
                        Set limit
                      </button>
                      <button mat-menu-item>
                        <mat-icon svgIcon="eraser" />
                        Clear cards
                      </button>
                      <mat-divider />
                      <button mat-menu-item>
                        <mat-icon svgIcon="trash-2" />
                        Delete
                      </button>
                    </mat-menu>
                  </div>

                  <!-- Lane body -->
                  <div
                    class="flex min-h-24 flex-auto flex-col gap-y-3 overflow-y-auto rounded-xl p-1"
                    cdkDropList
                    [cdkDropListData]="lane.cards"
                    (cdkDropListDropped)="dropCard($event, lane.id)"
                  >
                    @for (card of lane.cards; track card.id) {
                      <div
                        class="flex cursor-pointer flex-col gap-y-3 rounded-xl border bg-white p-4 hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700/50"
                        role="button"
                        tabindex="0"
                        cdkDrag
                        (cdkDragEnded)="dragEnded()"
                        (click)="openCard(card)"
                        (keydown.enter)="openCard(card)"
                      >
                        <!-- Drag placeholder -->
                        <div
                          class="h-24 rounded-xl border border-dashed bg-neutral-100 dark:bg-black/20"
                          *cdkDragPlaceholder
                        ></div>

                        <!-- Id & Priority -->
                        <div class="flex items-center gap-x-2">
                          <div class="text-sm text-neutral-500 tabular-nums">
                            {{ card.id }}
                          </div>

                          <!-- Spacer -->
                          <div class="flex-auto"></div>

                          <div
                            class="size-2 rounded-full"
                            [ngClass]="priorityColors[card.priority]"
                            [title]="card.priority"
                          ></div>
                        </div>

                        <!-- Title -->
                        <div class="leading-5 font-medium">
                          {{ card.title }}
                        </div>

                        <!-- Labels -->
                        @if (card.labels.length > 0) {
                          <div class="flex flex-wrap items-center gap-2">
                            @for (label of card.labels; track label) {
                              <div
                                class="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
                              >
                                {{ label }}
                              </div>
                            }
                          </div>
                        }

                        <!-- Footer -->
                        <div class="flex items-center gap-x-3">
                          @if (card.assignee) {
                            <img
                              class="size-6 shrink-0 rounded-full object-cover"
                              [src]="card.assignee.avatar"
                              alt="Assignee avatar"
                            />
                          }
                          @if (card.dueDate) {
                            <div class="text-sm text-neutral-500">
                              {{ card.dueDate | date: 'LLL dd' }}
                            </div>
                          }

                          <!-- Spacer -->
                          <div class="flex-auto"></div>

                          @if (card.subtasks) {
                            <div
                              class="flex items-center gap-x-1 text-sm text-neutral-500"
                            >
                              <mat-icon
                                class="size-4"
                                svgIcon="circle-check"
                              />
                              <span class="tabular-nums">
                                {{ card.subtasks.completed }}/{{
                                  card.subtasks.total
                                }}
                              </span>
                            </div>
                          }
                          @if (commentCount(card.comments) > 0) {
                            <div
                              class="flex items-center gap-x-1 text-sm text-neutral-500"
                            >
                              <mat-icon
                                class="size-4"
                                svgIcon="message-square"
                              />
                              <span class="tabular-nums">
                                {{ commentCount(card.comments) }}
                              </span>
                            </div>
                          }
                        </div>
                      </div>
                    }

                    <!-- Empty lane -->
                    @if (lane.cards.length === 0) {
                      <div
                        class="flex h-24 items-center justify-center rounded-xl border border-dashed text-sm text-neutral-500"
                      >
                        Drop cards here
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- List -->
            <div class="relative flex-auto overflow-auto">
              @for (lane of board(); track lane.id) {
                <!-- Group -->
                <div
                  class="sticky -top-px -mt-px flex items-center gap-x-2 border-t border-b bg-neutral-50 px-6 py-1 font-medium text-neutral-500 uppercase lg:px-8 dark:bg-neutral-900"
                >
                  <span>{{ lane.label }}</span>
                  <span class="tabular-nums">{{ lane.cards.length }}</span>
                </div>

                <!-- Card -->
                @for (card of lane.cards; track card.id) {
                  <a
                    class="flex cursor-pointer items-center gap-x-4 border-b px-6 py-3 hover:bg-neutral-100 lg:px-8 dark:hover:bg-white/2.5"
                    [routerLink]="['./', card.id]"
                  >
                    <div
                      class="size-2 shrink-0 rounded-full"
                      [ngClass]="priorityColors[card.priority]"
                      [title]="card.priority"
                    ></div>
                    <div class="text-sm text-neutral-500 tabular-nums">
                      {{ card.id }}
                    </div>
                    <div class="min-w-0 flex-auto truncate font-medium">
                      {{ card.title }}
                    </div>

                    @if (card.labels.length > 0) {
                      <div class="hidden items-center gap-2 @2xl:flex">
                        @for (label of card.labels; track label) {
                          <div
                            class="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
                          >
                            {{ label }}
                          </div>
                        }
                      </div>
                    }

                    @if (card.assignee) {
                      <img
                        class="size-6 shrink-0 rounded-full object-cover"
                        [src]="card.assignee.avatar"
                        alt="Assignee avatar"
                      />
                    }
                    <div
                      class="w-16 shrink-0 text-right text-sm text-neutral-500"
                    >
                      @if (card.dueDate) {
                        {{ card.dueDate | date: 'LLL dd' }}
                      }
                    </div>
                  </a>
                }

                <!-- Empty lane -->
                @if (lane.cards.length === 0) {
                  <div
                    class="border-b px-6 py-3 text-sm text-neutral-500 lg:px-8"
                  >
                    No cards
                  </div>
                }
              }
            </div>
          }
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export default class Scrumboard {
  // Dependencies
  private media = inject(Media);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scrumboardService = inject(ScrumboardService);

  // Timestamp of the last completed drag, used to ignore the click it emits
  private lastDragEnd = 0;

  // State
  protected data = this.scrumboardService.data;
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  protected view = signal<'board' | 'list'>('board');
  protected board = signal(
    this.data.lanes.map((lane) => ({
      ...lane,
      cards: this.data.cards.filter((card) => card.lane === lane.id),
    }))
  );
  protected priorityColors: Record<string, string> = {
    urgent: 'bg-red-500',
    high: 'bg-amber-500',
    medium: 'bg-blue-500',
    low: 'bg-green-500',
    none: 'bg-neutral-300 dark:bg-neutral-600',
  };
  protected avatars = [
    'images/photos/male-01.jpg',
    'images/photos/female-01.jpg',
    'images/photos/male-03.jpg',
    'images/photos/female-03.jpg',
  ];
  selectedCard = signal<Card | null>(null);

  commentCount(comments: Card['comments']) {
    return comments.reduce(
      (total, comment) => total + 1 + (comment.replies?.length ?? 0),
      0
    );
  }

  dropCard(event: CdkDragDrop<Card[]>, laneId: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      event.container.data[event.currentIndex].lane = laneId;
    }

    // The lane arrays are mutated in place, so notify the signal manually
    this.board.set([...this.board()]);
  }

  dragEnded() {
    this.lastDragEnd = Date.now();
  }

  openCard(card: Card) {
    if (Date.now() - this.lastDragEnd < 200) {
      return;
    }
    this.router.navigate(['./', card.id], { relativeTo: this.route });
  }

  closeCard() {
    const selectedCard = this.selectedCard();
    if (selectedCard) {
      this.selectedCard.set(null);
      this.router.navigate(['/admin/scrumboard']);
    }
  }
}
