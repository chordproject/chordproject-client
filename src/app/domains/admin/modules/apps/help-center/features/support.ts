import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatInput,
  MatLabel,
} from '@angular/material/input';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'help-center-support',
  imports: [
    CdkTextareaAutosize,
    MatButton,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    FormField,
  ],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-4xl flex-auto flex-col items-start p-6 pt-2 lg:p-10 lg:pt-16"
    >
      <!-- Header -->
      <a
        matButton
        class="-ml-3"
        routerLink=".."
      >
        <mat-icon svgIcon="move-left" />
        Back to Help Center
      </a>

      <div class="relative mt-3 flex flex-col">
        <div class="text-xl font-bold tracking-tighter sm:text-4xl">
          Contact us
        </div>
        <div class="mt-1 text-neutral-500">
          Your request will be processed and our support staff will get back to
          you in 24 hours.
        </div>
      </div>

      <!-- Form -->
      <form
        class="mt-8 flex w-full flex-auto flex-col gap-y-6"
        (submit)="send($event)"
      >
        <!-- Name -->
        <mat-form-field class="mt-12 w-full">
          <mat-label>Name</mat-label>
          <input
            matInput
            [formField]="supportForm.name"
          />
          <mat-error>
            @for (error of supportForm.name().errors(); track error) {
              {{ error.message }}
            }
          </mat-error>
        </mat-form-field>

        <!-- Email -->
        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input
            matInput
            [formField]="supportForm.email"
          />
          <mat-error>
            @for (error of supportForm.email().errors(); track error) {
              {{ error.message }}
            }
          </mat-error>
        </mat-form-field>

        <!-- Subject -->
        <mat-form-field class="w-full">
          <mat-label>Subject</mat-label>
          <input
            matInput
            [formField]="supportForm.subject"
          />
          <mat-error>
            @for (error of supportForm.subject().errors(); track error) {
              {{ error.message }}
            }
          </mat-error>
        </mat-form-field>

        <!-- Message -->
        <mat-form-field class="w-full">
          <mat-label>Message</mat-label>
          <textarea
            matInput
            [formField]="supportForm.message"
            cdkTextareaAutosize
            [cdkAutosizeMinRows]="4"
            cdkAutosizeMaxRows="6"
          ></textarea>
          <mat-error>
            @for (error of supportForm.subject().errors(); track error) {
              {{ error.message }}
            }
          </mat-error>
        </mat-form-field>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-x-3">
          <button
            type="reset"
            matButton
            (click)="this.reset()"
          >
            Clear
          </button>

          <button matButton="filled">Submit</button>
        </div>
      </form>
    </div>
  `,
})
export default class HelpCenterSupport {
  // State
  protected supportFormModel = signal({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  protected supportForm = form(this.supportFormModel, (schema) => {
    required(schema.name, { message: 'Name is required' });
    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Enter a valid email address' });
    required(schema.subject, { message: 'Subject is required' });
    required(schema.message, { message: 'Message is required' });
  });

  reset() {
    this.supportForm().reset({
      name: '',
      message: '',
      email: '',
      subject: '',
    });
  }

  send(event: Event) {
    event.preventDefault();
  }
}
