import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  afterNextRender,
  Component,
  inject,
  input,
  linkedSignal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { NotesService } from '@/app/domains/admin/modules/apps/notes/data/notes';

@Component({
  selector: 'note',
  imports: [
    FormField,
    CdkTextareaAutosize,
    MatButton,
    MatIcon,
    MatCheckbox,
    MatDialogClose,
  ],
  template: `
    <ng-template #content>
      @let note = this.note();

      <div class="flex w-full flex-col p-4">
        <!-- Title -->
        <input
          type="text"
          class="rounded-md p-2 font-medium outline-none focus-within:bg-black/5"
          [formField]="noteForm.title"
        />

        <!-- Content -->
        <textarea
          class="rounded-md p-2 outline-none focus-within:bg-black/5"
          [formField]="noteForm.content"
          cdkTextareaAutosize
          [cdkAutosizeMinRows]="2"
          [cdkAutosizeMaxRows]="5"
        ></textarea>

        <!-- Todo -->
        @if (note.tasks && note.tasks.length > 0) {
          <div class="mt-2 flex flex-col items-start gap-y-1 py-2">
            @for (task of note.tasks; track task) {
              <div class="items -center flex gap-2">
                <mat-checkbox
                  [checked]="task.completed"
                  #checkbox
                >
                  <span
                    [class.line-through]="checkbox.checked"
                    [class.text-neutral-500]="checkbox.checked"
                  >
                    {{ task.content }}
                  </span>
                </mat-checkbox>
              </div>
            }

            <!-- Add task -->
            <button matButton="text">
              <mat-icon svgIcon="plus" />
              Add task
            </button>
          </div>
        }

        <!-- Labels -->
        @if (note.labels && note.labels.length > 0) {
          <div class="mt-2 flex flex-wrap items-center gap-2 p-2">
            @for (label of note.labels; track label) {
              <div
                class="rounded-lg bg-neutral-200 px-2 py-1 text-xs font-medium text-neutral-500 dark:bg-black/20"
              >
                {{ label }}
              </div>
            }

            <!-- Edit labels -->
            <button
              matButton="text"
              class="h-6 text-xs text-neutral-500"
            >
              <mat-icon svgIcon="square-pen" />
              Edit
            </button>
          </div>
        }

        <!-- Buttons -->
        <div class="mt-4 flex items-center justify-end gap-x-2">
          <button
            matButton="outlined"
            matDialogClose
          >
            Cancel
          </button>
          <button
            matButton="filled"
            matDialogClose
          >
            Save
          </button>
        </div>
      </div>
    </ng-template>
  `,
})
export default class Note {
  // Dependencies
  private matDialog = inject(MatDialog);
  private notesService = inject(NotesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Inputs / Outputs
  readonly noteId = input.required({ alias: 'id' });

  // Queries
  readonly content = viewChild.required<TemplateRef<unknown>>('content');

  // State
  protected note = linkedSignal(
    () =>
      this.notesService.data.notes.find((note) => note.id === this.noteId())!
  );
  protected noteForm = form(this.note);

  constructor() {
    afterNextRender(() => {
      const dialogRef = this.matDialog.open(this.content(), {
        panelClass: 'w-full max-w-lg'.split(' '),
      });
      dialogRef
        .afterClosed()
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigate(['..'], { relativeTo: this.route });
        });
    });
  }
}
