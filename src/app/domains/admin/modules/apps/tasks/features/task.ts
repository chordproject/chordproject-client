import { TextFieldModule } from '@angular/cdk/text-field';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatOption } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksService } from '@/app/domains/admin/modules/apps/tasks/data/tasks';
import Tasks from '@/app/domains/admin/modules/apps/tasks/features/tasks';

@Component({
  selector: 'task',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatRippleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    FormField,
    MatSelect,
    MatOption,
  ],
  template: `
    <div class="flex flex-auto">
      <form
        class="flex flex-auto flex-col overflow-y-auto p-6 pt-10 sm:p-8 sm:pt-10"
      >
        <!-- Header -->
        <div class="-mt-3 -ml-4 flex items-center justify-between">
          <button
            matButton
            class="pr-4 pl-3.5"
          >
            <mat-icon
              [svgIcon]="!taskModel().completed ? 'circle' : 'circle-check'"
            />
            @if (!taskModel().completed) {
              Mark as complete
            } @else {
              Mark as incomplete
            }
          </button>

          <div class="flex items-center">
            <!-- More menu -->
            <button
              matIconButton
              [matMenuTriggerFor]="moreMenu"
            >
              <mat-icon svgIcon="ellipsis" />
            </button>
            <mat-menu #moreMenu="matMenu">
              <button mat-menu-item>
                <mat-icon svgIcon="trash" />
                <span
                  >Delete
                  {{ task().type === 'task' ? 'task' : 'section' }}</span
                >
              </button>
            </mat-menu>

            <!-- Close button -->
            <button
              type="button"
              matIconButton
              (click)="closeTask()"
            >
              <mat-icon svgIcon="x" />
            </button>
          </div>
        </div>

        <mat-divider class="mt-6 mb-8"></mat-divider>

        <!-- Title -->
        <mat-form-field class="w-full">
          <mat-label>{{
            task().type === 'task' ? 'Task title' : 'Section title'
          }}</mat-label>
          <textarea
            matInput
            [formField]="taskForm.title"
            [spellcheck]="false"
            cdkTextareaAutosize
          ></textarea>
        </mat-form-field>

        <!-- Priority and Due date -->
        <div
          class="mt-8 grid grid-cols-1 items-center gap-y-8 sm:grid-cols-2 sm:gap-x-3 sm:gap-y-0"
        >
          <!-- Priority -->
          <mat-form-field class="flex-auto">
            <mat-label>Priority</mat-label>
            <mat-select
              class="w-full"
              [formField]="taskForm.priority"
              [panelWidth]="null"
            >
              <mat-option [value]="2">High</mat-option>
              <mat-option [value]="1">Medium</mat-option>
              <mat-option [value]="0">Low</mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Due date -->
          <mat-form-field class="flex-auto">
            <mat-label>Due date</mat-label>
            <input
              matInput
              [matDatepicker]="dueDatePicker"
              [formField]="taskForm.dueDate"
            />
            <mat-datepicker-toggle
              matIconSuffix
              [for]="dueDatePicker"
            ></mat-datepicker-toggle>
            <mat-datepicker #dueDatePicker></mat-datepicker>
          </mat-form-field>
        </div>

        <!-- Notes -->
        <div class="mt-8">
          <mat-form-field class="w-full">
            <mat-label>Notes</mat-label>
            <textarea
              matInput
              [formField]="taskForm.notes"
              [spellcheck]="false"
              cdkTextareaAutosize
            ></textarea>
          </mat-form-field>
        </div>
      </form>
    </div>
  `,
})
export default class Task {
  // Dependencies
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tasksService = inject(TasksService);
  private tasks = inject(Tasks);

  // Input / Output
  readonly taskId = input.required({ alias: 'id' });

  // State
  protected data = this.tasksService.data;
  protected task = computed(
    () => this.data.tasks.find((task) => task.id === this.taskId())!
  );
  protected taskModel = linkedSignal(() => this.task());
  protected taskForm = form(this.taskModel);

  constructor() {
    afterNextRender(() => {
      this.tasks.selectedTask.set(this.task());
    });

    effect(() => {
      const task = this.task();
      this.taskModel.set(task);
    });
  }

  closeTask() {
    this.tasks.selectedTask.set(null);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
