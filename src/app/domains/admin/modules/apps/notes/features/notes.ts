import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { Note } from '@/app/domains/admin/modules/apps/notes/data/model';
import { NotesService } from '@/app/domains/admin/modules/apps/notes/data/notes';

@Component({
  selector: 'notes',
  imports: [
    MatButton,
    MatIcon,
    RouterOutlet,
    MatFormField,
    MatInput,
    MatPrefix,
    MatCard,
    RouterLink,
    DatePipe,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col p-6 lg:px-8 lg:py-8"
    >
      <!-- Header -->
      <div class="flex items-center gap-x-4">
        <mat-form-field class="flex-auto">
          <input
            type="text"
            placeholder="Search notes"
            matInput
          />
          <mat-icon
            svgIcon="search"
            matIconPrefix
          />
        </mat-form-field>

        <!-- Actions -->
        <button matButton="filled">
          <mat-icon svgIcon="plus" />
          New
        </button>
      </div>

      <!-- Notes -->
      @if (notes && notes.length > 0) {
        <div
          class="mt-8 columns-1 gap-4 md:gap-6 @2xl:columns-2 @4xl:columns-3"
        >
          @for (note of notes; track note.id) {
            <mat-card
              appearance="outlined"
              class="relative isolate mb-4 flex min-h-30 break-inside-avoid flex-col gap-y-1 overflow-hidden p-4 ring-neutral-200 hover:ring-2 md:mb-6 dark:ring-neutral-700"
            >
              <a
                class="absolute inset-0 z-10"
                [routerLink]="note.id"
                ><span></span
              ></a>

              <!-- Image -->
              @if (note.image) {
                <img
                  class="-mx-4 -mt-4 mb-3 w-[calc(100%+2rem)] max-w-none object-cover"
                  [src]="note.image"
                  alt="Note image"
                />
              }

              @if (note.title) {
                <div class="font-medium">{{ note.title }}</div>
              }

              @if (note.content) {
                <div class="line-clamp-2 text-neutral-500">
                  {{ note.content }}
                </div>
              }

              <!-- Tasks -->
              @if (note.tasks && note.tasks.length > 0) {
                <div class="mt-3 flex flex-col gap-y-1">
                  @for (task of note.tasks; track task.id) {
                    @if ($index < 3) {
                      <div class="flex items-center gap-x-2 text-sm">
                        <mat-icon
                          class="size-4 shrink-0 text-neutral-400"
                          [svgIcon]="task.completed ? 'circle-check' : 'circle'"
                        />
                        <div
                          class="truncate"
                          [class]="
                            task.completed
                              ? 'text-neutral-400 line-through'
                              : 'text-neutral-500'
                          "
                        >
                          {{ task.content }}
                        </div>
                      </div>
                    }
                  }

                  @if (note.tasks.length > 3) {
                    <div class="text-sm text-neutral-400">
                      +{{ note.tasks.length - 3 }} more
                    </div>
                  }
                </div>
              }

              <div
                class="mt-auto flex items-center justify-between gap-x-2 pt-4"
              >
                <div class="flex flex-wrap items-center gap-2">
                  @if (note.labels && note.labels.length > 0) {
                    @for (label of note.labels; track label) {
                      <div
                        class="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
                      >
                        {{ label }}
                      </div>
                    }
                  }

                  @if (note.tasks && note.tasks.length > 0) {
                    <div
                      class="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
                    >
                      {{ completedTaskCount(note.tasks) }}/{{
                        note.tasks.length
                      }}
                    </div>
                  }

                  @if (note.reminder) {
                    <div
                      class="flex items-center gap-x-1 rounded-lg bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
                    >
                      <mat-icon
                        class="size-3.5"
                        svgIcon="bell"
                      />
                      {{ note.reminder | date: 'MMM d' }}
                    </div>
                  }
                </div>

                <div class="flex-auto"></div>

                <div
                  class="text-xs font-medium whitespace-nowrap text-neutral-500"
                >
                  {{ note.createdAt | date: 'MMM d, y' }}
                </div>
              </div>
            </mat-card>
          }
        </div>
      }

      <!-- Router outlet for note dialog -->
      <router-outlet />
    </div>
  `,
})
export default class Notes {
  // Dependencies
  private media = inject(Media);
  private notesService = inject(NotesService);

  // State
  protected notes = this.notesService.data.notes;
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );

  completedTaskCount(tasks: NonNullable<Note['tasks']>) {
    return tasks.filter((task) => task.completed).length;
  }
}
