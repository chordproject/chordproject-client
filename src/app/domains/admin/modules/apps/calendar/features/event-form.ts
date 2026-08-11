import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, inject, linkedSignal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatSuffix } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';
import { enUS } from 'date-fns/locale';
import { CalendarService } from '@/app/domains/admin/modules/apps/calendar/data/calendar';
import { CalendarEvent } from '@/app/domains/admin/modules/apps/calendar/data/model';

@Component({
  selector: 'event-form',
  imports: [
    CdkTextareaAutosize,
    FormField,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDialogClose,
    MatFormField,
    MatInput,
    MatSlideToggle,
    MatSuffix,
    MatTimepicker,
    MatTimepickerInput,
    MatTimepickerToggle,
  ],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: enUS,
    },
    provideDateFnsAdapter({
      parse: {
        dateInput: 'P',
        timeInput: 'p',
      },
      display: {
        dateInput: 'eee MMM d',
        timeInput: 'p',
        monthYearLabel: 'LLL uuuu',
        dateA11yLabel: 'PP',
        monthYearA11yLabel: 'LLLL uuuu',
        timeOptionLabel: 'p',
      },
    }),
  ],
  template: `
    <div class="flex flex-col p-6">
      <div class="text-xl font-semibold tracking-tighter">
        {{ isNew ? 'New event' : 'Edit event' }}
      </div>

      <form
        class="mt-6 flex flex-col gap-y-4"
        (submit)="save($event)"
      >
        <!-- Title -->
        <mat-form-field class="w-full">
          <input
            matInput
            placeholder="Title"
            [formField]="eventForm.title"
          />
        </mat-form-field>

        <!-- All-day toggle -->
        <mat-slide-toggle [formField]="eventForm.allDay">
          All day
        </mat-slide-toggle>

        <div class="flex items-center gap-x-2">
          <!-- Start date -->
          <mat-form-field class="flex-auto">
            <input
              matInput
              [matDatepicker]="startDatePicker"
              [formField]="eventForm.start"
            />
            <mat-datepicker-toggle
              [for]="startDatePicker"
              matIconSuffix
            />
            <mat-datepicker #startDatePicker />
          </mat-form-field>

          <!-- Start time -->
          @if (!eventFormModel().allDay) {
            <mat-form-field class="max-w-32 flex-auto">
              <input
                matInput
                [matTimepicker]="startTimePicker"
                [formField]="eventForm.start"
              />
              <mat-timepicker-toggle
                [for]="startTimePicker"
                matIconSuffix
              />
              <mat-timepicker #startTimePicker />
            </mat-form-field>
          }
        </div>

        <div class="flex items-center gap-x-2">
          <!-- End date -->
          <mat-form-field class="flex-auto">
            <input
              matInput
              [matDatepicker]="endDatePicker"
              [formField]="eventForm.end"
            />
            <mat-datepicker-toggle
              [for]="endDatePicker"
              matIconSuffix
            />
            <mat-datepicker #endDatePicker />
          </mat-form-field>

          <!-- End time -->
          @if (!eventFormModel().allDay) {
            <mat-form-field class="max-w-32 flex-auto">
              <input
                matInput
                [matTimepicker]="endTimePicker"
                [formField]="eventForm.end"
              />
              <mat-timepicker-toggle
                [for]="endTimePicker"
                matIconSuffix
              />
              <mat-timepicker #endTimePicker />
            </mat-form-field>
          }
        </div>

        <!-- Location -->
        <mat-form-field class="w-full">
          <input
            matInput
            placeholder="Location"
            [formField]="eventForm.location"
          />
        </mat-form-field>

        <!-- Description -->
        <mat-form-field class="w-full">
          <textarea
            matInput
            class="w-full"
            placeholder="Description"
            cdkTextareaAutosize
            cdkAutosizeMinRows="3"
            cdkAutosizeMaxRows="10"
            [formField]="eventForm.description"
          ></textarea>
        </mat-form-field>

        <div class="flex items-center gap-x-3">
          @if (!isNew) {
            <button
              type="button"
              matButton
              class="text-red-600 dark:text-red-400"
              (click)="delete()"
            >
              Delete
            </button>
          }

          <!-- Spacer -->
          <div class="flex-auto"></div>

          <button
            type="button"
            matButton
            matDialogClose
          >
            Cancel
          </button>
          <button
            matButton="filled"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  `,
})
export default class EventForm {
  // Dependencies
  private calendarService = inject(CalendarService);
  private dialogRef = inject(MatDialogRef<EventForm>);

  // State
  protected event = inject<CalendarEvent>(MAT_DIALOG_DATA);
  protected isNew = !this.event.id;
  protected readonly eventFormModel = linkedSignal(() => this.event);

  // Forms
  protected eventForm = form(this.eventFormModel, (form) => {
    required(form.title, { message: 'You must enter a title' });
  });

  save(event: Event) {
    event.preventDefault();

    submit(this.eventForm, async () => {
      const value = this.eventFormModel();

      if (this.isNew) {
        this.calendarService.addEvent(value);
      } else {
        this.calendarService.updateEvent(value);
      }

      this.dialogRef.close();
    });
  }

  delete() {
    if (this.event.id) {
      this.calendarService.deleteEvent(this.event.id);
    }

    this.dialogRef.close();
  }
}
