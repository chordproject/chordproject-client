import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, inject, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { Task } from '@/app/domains/admin/modules/apps/tasks/data/model';
import { TasksService } from '@/app/domains/admin/modules/apps/tasks/data/tasks';

@Component({
  selector: 'tasks',
  imports: [
    MatSidenavModule,
    RouterOutlet,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    CdkDropList,
    CdkDrag,
    CdkDragPreview,
    CdkDragHandle,
    RouterLink,
    TitleCasePipe,
    DatePipe,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatFormField,
    MatInput,
    MatPrefix,
  ],
  host: {
    class: 'h-[calc(1dvh-57px)]',
  },
  template: `
    <div
      class="@container mx-auto flex w-full flex-auto flex-col overflow-hidden"
    >
      <mat-sidenav-container
        class="h-full flex-auto [&_.mat-drawer-backdrop]:fixed"
        (backdropClick)="closeTask()"
      >
        <!-- Drawer -->
        <mat-sidenav
          class="w-full bg-white sm:w-lg dark:bg-neutral-900"
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="!!selectedTask()"
          [position]="'end'"
          [fixedInViewport]="isMobile()"
          disableClose
        >
          <router-outlet></router-outlet>
        </mat-sidenav>

        <mat-sidenav-content
          class="flex flex-auto flex-col"
          [class.border-r]="!!selectedTask()"
        >
          <!-- Header -->
          <div class="flex items-center gap-x-4 px-6 py-4 lg:px-10 lg:py-8">
            <div class="flex flex-col gap-y-0.5">
              <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
                Tasks
              </div>
              <div class="text-neutral-500">
                Manage your tasks and stay organized.
              </div>
            </div>

            <!-- Spacer -->
            <div class="flex-auto"></div>

            <!-- Search -->
            <mat-form-field class="w-40 sm:w-64">
              <mat-icon
                matPrefix
                svgIcon="search"
              />
              <input
                placeholder="Search tasks"
                matInput
              />
            </mat-form-field>

            <!-- Actions -->
            <div>
              <button
                matButton="filled"
                [matMenuTriggerFor]="actionsMenu"
              >
                <mat-icon svgIcon="plus" />
                Add
              </button>
              <mat-menu
                xPosition="before"
                #actionsMenu
              >
                <button mat-menu-item>Section</button>
                <button mat-menu-item>Task</button>
              </mat-menu>
            </div>
          </div>

          <!-- Tasks -->
          @if (data.tasks && data.tasks.length > 0) {
            <div
              class="divide-y"
              cdkDropList
              [cdkDropListData]="data.tasks"
              (cdkDropListDropped)="orderTasks($event)"
            >
              <!-- Task -->
              @for (task of data.tasks; track task.id; let first = $first) {
                <div
                  [id]="'task-' + task.id"
                  class="group w-full select-none hover:bg-neutral-100 dark:hover:bg-white/2.5"
                  [class.h-10]="task.type === 'section'"
                  [class.bg-neutral-50]="task.type === 'section'"
                  [class.dark:bg-neutral-800]="task.type === 'section'"
                  [class.font-semibold]="task.type === 'section'"
                  [class.text-md]="task.type === 'section'"
                  [class.h-14]="task.type === 'task'"
                  [class.text-neutral-500]="task.completed"
                  [class.border-t]="first"
                  cdkDrag
                  [cdkDragLockAxis]="'y'"
                >
                  <!-- Drag preview -->
                  <div
                    class="flex size-0 flex-0"
                    *cdkDragPreview
                  ></div>

                  <div class="relative flex h-full items-center pl-10">
                    <!-- Drag handle -->
                    <div
                      class="absolute inset-y-0 left-0 flex w-8 cursor-move items-center justify-center md:hidden md:group-hover:flex"
                      cdkDragHandle
                    >
                      <mat-icon
                        class="text-neutral-500"
                        svgIcon="grip-vertical"
                      />
                    </div>

                    <!-- Complete task button -->
                    @if (task.type === 'task') {
                      <button
                        matIconButton
                        class="mr-2 -ml-2.5 leading-none"
                      >
                        @if (task.completed) {
                          <mat-icon
                            class="text-primary-600"
                            svgIcon="circle-check"
                          />
                        }
                        @if (!task.completed) {
                          <mat-icon
                            class="text-neutral-500"
                            svgIcon="circle"
                          />
                        }
                      </button>
                    }

                    <!-- Task link -->
                    <a
                      class="flex h-full min-w-0 flex-auto items-center pr-7"
                      [routerLink]="[task.id]"
                    >
                      <!-- Title & Placeholder -->
                      <div class="mr-2 flex-auto truncate">
                        @if (task.title) {
                          <span>{{ task.title }}</span>
                        }
                        @if (!task.title) {
                          <span class="text-neutral-500 select-none"
                            >{{ task.type | titlecase }} title
                          </span>
                        }
                      </div>
                      <!-- Priority -->
                      @if (task.type === 'task') {
                        <div class="mr-3 h-4 w-4">
                          <!-- Low -->
                          @if (task.priority === 0) {
                            <mat-icon
                              class="size-4 text-green-600 dark:text-green-400"
                              svgIcon="move-down"
                              title="Low"
                            />
                          }
                          <!-- High -->
                          @if (task.priority === 2) {
                            <mat-icon
                              class="size-4 text-red-600 dark:text-red-400"
                              svgIcon="move-up"
                              title="High"
                            />
                          }
                        </div>
                      }
                      <!-- Due date -->
                      @if (task.type === 'task') {
                        <div class="text-sm whitespace-nowrap text-neutral-500">
                          {{ task.dueDate | date: 'LLL dd' }}
                        </div>
                      }
                    </a>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="flex flex-auto flex-col items-center justify-center">
              <mat-icon
                class="size-12 text-neutral-500"
                svgIcon="list-todo"
              />
              <div class="mt-4 text-xl font-medium tracking-tight">
                No tasks yet
              </div>
            </div>
          }
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export default class Tasks {
  // Dependencies
  private media = inject(Media);
  private tasksService = inject(TasksService);
  private router = inject(Router);

  // State
  protected data = this.tasksService.data;
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  selectedTask = signal<Task | null>(null);

  orderTasks(event: CdkDragDrop<Task[]>): void {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  closeTask() {
    const selectedTask = this.selectedTask();
    if (selectedTask) {
      this.selectedTask.set(null);
      this.router.navigate(['/admin/tasks']);
    }
  }
}
