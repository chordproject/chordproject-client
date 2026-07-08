import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { DatePipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrumboardService } from '@/app/domains/admin/modules/apps/scrumboard/data/scrumboard';
import Scrumboard from '@/app/domains/admin/modules/apps/scrumboard/features/scrumboard';

@Component({
  selector: 'card',
  imports: [
    CdkTextareaAutosize,
    DatePipe,
    MatIcon,
    MatIconButton,
    MatFormField,
    MatInput,
    MatTooltip,
  ],
  template: `
    @let card = this.card();
    <div class="flex w-full flex-col">
      <!-- Header -->
      <div
        class="relative w-full border-b bg-neutral-100 px-8 py-8 sm:px-8 dark:bg-neutral-800"
      >
        <div class="mx-auto flex w-full max-w-3xl items-center">
          <div class="flex flex-col gap-y-0.5">
            <div class="text-2xl font-bold tabular-nums">
              {{ card.id }}
            </div>
            <div class="text-neutral-500">
              {{ card.createdAt | date: 'longDate' }}
            </div>
          </div>

          <!-- Spacer -->
          <div class="flex-auto"></div>

          <!-- Close button -->
          <button
            matIconButton
            [matTooltip]="'Close'"
            (click)="closeCard()"
          >
            <mat-icon svgIcon="x"></mat-icon>
          </button>
        </div>
      </div>

      <!-- Card -->
      <div class="relative flex flex-auto flex-col items-center p-6 sm:p-12">
        <div class="w-full max-w-3xl">
          <!-- Title -->
          <div class="text-xl font-semibold tracking-tight">
            {{ card.title }}
          </div>

          <!-- Description -->
          @if (card.description) {
            <div class="mt-2 text-neutral-500">
              {{ card.description }}
            </div>
          }

          <div class="mt-10 flex flex-col space-y-8">
            <!-- Priority -->
            <div class="flex items-center">
              <mat-icon
                class="shrink-0"
                svgIcon="flag"
              />
              <div class="ml-6 flex items-center gap-x-2 capitalize">
                <div
                  class="size-2 rounded-full"
                  [class]="priorityColor()"
                ></div>
                {{ card.priority }}
              </div>
            </div>

            <!-- Assignee -->
            <div class="flex items-center">
              <mat-icon
                class="shrink-0"
                svgIcon="user"
              />
              @if (card.assignee) {
                <div class="ml-6 flex items-center">
                  <img
                    class="size-8 shrink-0 rounded-full object-cover"
                    [src]="card.assignee.avatar"
                    alt="Assignee avatar"
                  />
                  <div class="ml-3 font-medium">{{ card.assignee.name }}</div>
                </div>
              } @else {
                <div class="ml-6 text-neutral-500">Unassigned</div>
              }
            </div>

            <!-- Due date -->
            <div class="flex items-center">
              <mat-icon
                class="shrink-0"
                svgIcon="calendar"
              />
              <div class="ml-6">
                @if (card.dueDate) {
                  {{ card.dueDate | date: 'longDate' }}
                } @else {
                  <span class="text-neutral-500">No due date</span>
                }
              </div>
            </div>

            <!-- Labels -->
            <div class="flex">
              <mat-icon
                class="mt-1 shrink-0"
                svgIcon="tag"
              />
              <div class="ml-6 flex flex-wrap items-center gap-2">
                @for (label of card.labels; track label) {
                  <div
                    class="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
                  >
                    {{ label }}
                  </div>
                } @empty {
                  <span class="text-neutral-500">No labels</span>
                }
              </div>
            </div>

            <!-- Subtasks -->
            <div class="flex">
              <mat-icon
                class="mt-1 shrink-0"
                svgIcon="circle-check"
              />
              <div class="ml-6 w-full">
                @if (card.subtasks) {
                  <div class="flex items-center">
                    <div class="flex-auto text-neutral-500">Subtasks</div>
                    <div class="tabular-nums">
                      {{ card.subtasks.completed }}/{{ card.subtasks.total }}
                    </div>
                  </div>
                  <div
                    class="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700"
                  >
                    <div
                      class="h-full rounded-full bg-primary-600"
                      [style.width.%]="progress()"
                    ></div>
                  </div>
                } @else {
                  <span class="text-neutral-500">No subtasks</span>
                }
              </div>
            </div>
          </div>

          <!-- Comments -->
          <div class="mt-10 flex flex-col space-y-8">
            <div class="flex items-center gap-x-2">
              <div class="font-medium">Comments</div>
              <div class="text-neutral-500 tabular-nums">
                {{ commentCount() }}
              </div>
            </div>

            <!-- Thread -->
            @for (comment of card.comments; track comment.id) {
              <div class="flex flex-col gap-y-4">
                <div class="flex">
                  <img
                    class="size-8 shrink-0 rounded-full object-cover"
                    [src]="comment.author.avatar"
                    alt="Author avatar"
                  />
                  <div class="ml-3 flex flex-col gap-y-1">
                    <div class="flex items-center gap-x-2">
                      <div class="font-medium">{{ comment.author.name }}</div>
                      <div class="text-sm text-neutral-500">
                        {{ comment.createdAt | date: 'MMM d' }}
                      </div>
                    </div>
                    <div>{{ comment.message }}</div>
                    <button
                      class="self-start text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                      type="button"
                    >
                      Reply
                    </button>
                  </div>
                </div>

                <!-- Replies -->
                @for (reply of comment.replies; track reply.id) {
                  <div class="ml-11 flex">
                    <img
                      class="size-6 shrink-0 rounded-full object-cover"
                      [src]="reply.author.avatar"
                      alt="Author avatar"
                    />
                    <div class="ml-3 flex flex-col gap-y-1">
                      <div class="flex items-center gap-x-2">
                        <div class="font-medium">{{ reply.author.name }}</div>
                        <div class="text-sm text-neutral-500">
                          {{ reply.createdAt | date: 'MMM d' }}
                        </div>
                      </div>
                      <div>{{ reply.message }}</div>
                    </div>
                  </div>
                }
              </div>
            } @empty {
              <div class="text-neutral-500">No comments yet</div>
            }

            <!-- Composer -->
            <div class="flex items-start">
              <img
                class="mt-2 size-8 shrink-0 rounded-full object-cover"
                src="images/photos/male-01.jpg"
                alt="Your avatar"
              />
              <mat-form-field class="ml-3 w-full">
                <textarea
                  placeholder="Write a comment..."
                  matInput
                  cdkTextareaAutosize
                  [cdkAutosizeMinRows]="2"
                  cdkAutosizeMaxRows="6"
                ></textarea>
              </mat-form-field>
              <button
                class="mt-1 ml-2"
                matIconButton
                [matTooltip]="'Send'"
              >
                <mat-icon svgIcon="send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class Card {
  // Dependencies
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scrumboardService = inject(ScrumboardService);
  private scrumboard = inject(Scrumboard);

  // Input / Output
  readonly cardId = input.required({ alias: 'id' });

  // State
  protected data = this.scrumboardService.data;
  protected card = computed(() =>
    this.data.cards.find((card) => card.id === this.cardId())!
  );
  protected priorityColor = computed(() => {
    const priority = this.card().priority;
    if (priority === 'urgent') {
      return 'bg-red-500';
    }
    if (priority === 'high') {
      return 'bg-amber-500';
    }
    if (priority === 'medium') {
      return 'bg-blue-500';
    }
    if (priority === 'low') {
      return 'bg-green-500';
    }
    return 'bg-neutral-300 dark:bg-neutral-600';
  });
  protected commentCount = computed(() =>
    this.card().comments.reduce(
      (total, comment) => total + 1 + (comment.replies?.length ?? 0),
      0
    )
  );
  protected progress = computed(() => {
    const subtasks = this.card().subtasks;
    if (!subtasks || subtasks.total === 0) {
      return 0;
    }
    return (subtasks.completed / subtasks.total) * 100;
  });

  constructor() {
    afterNextRender(() => {
      this.scrumboard.selectedCard.set(this.card());
    });
  }

  closeCard() {
    this.scrumboard.selectedCard.set(null);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
