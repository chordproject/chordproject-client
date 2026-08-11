import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, inject, signal } from '@angular/core';
import {
  email,
  form,
  FormField,
  required,
  submit,
} from '@angular/forms/signals';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { formatISO } from 'date-fns';
import { MailboxService } from '@/app/domains/admin/modules/apps/mailbox/data/mailbox';

@Component({
  selector: 'compose',
  imports: [
    CdkTextareaAutosize,
    FormField,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatTooltip,
  ],
  template: `
    <div class="flex flex-col p-6">
      <div class="text-xl font-semibold tracking-tighter">New message</div>

      <form
        class="mt-6 flex flex-col gap-y-4"
        (submit)="send($event)"
      >
        <!-- To -->
        <mat-form-field class="w-full">
          <input
            matInput
            placeholder="To"
            [formField]="composeForm.to"
          />
        </mat-form-field>

        <!-- Subject -->
        <mat-form-field class="w-full">
          <input
            matInput
            placeholder="Subject"
            [formField]="composeForm.subject"
          />
        </mat-form-field>

        <!-- Body -->
        <mat-form-field class="w-full">
          <textarea
            matInput
            class="w-full"
            placeholder="Write your message"
            cdkTextareaAutosize
            cdkAutosizeMinRows="6"
            cdkAutosizeMaxRows="16"
            [formField]="composeForm.body"
          ></textarea>
        </mat-form-field>

        <div class="flex items-center gap-x-1">
          <!-- Decorative actions -->
          <button
            type="button"
            matIconButton
            [matTooltip]="'Attach a file'"
          >
            <mat-icon svgIcon="paperclip" />
          </button>
          <button
            type="button"
            matIconButton
            [matTooltip]="'Insert a link'"
          >
            <mat-icon svgIcon="link" />
          </button>

          <!-- Spacer -->
          <div class="flex-auto"></div>

          <button
            type="button"
            matButton
            matDialogClose
          >
            Discard
          </button>
          <button
            matButton="filled"
            type="submit"
          >
            <mat-icon svgIcon="send" />
            Send
          </button>
        </div>
      </form>
    </div>
  `,
})
export default class Compose {
  // Dependencies
  private mailboxService = inject(MailboxService);
  private dialogRef = inject(MatDialogRef<Compose>);

  // State
  protected composeFormModel = signal({
    to: '',
    subject: '',
    body: '',
  });

  // Forms
  protected composeForm = form(this.composeFormModel, (form) => {
    required(form.to, { message: 'You must enter a recipient' });
    email(form.to, { message: 'You must enter a valid email address' });
    required(form.subject, { message: 'You must enter a subject' });
  });

  send(event: Event) {
    event.preventDefault();

    submit(this.composeForm, async () => {
      const value = this.composeFormModel();

      // Add the mail to the 'sent' folder, demo purposes only
      this.mailboxService.mails.update((mails) => [
        ...mails,
        {
          id: crypto.randomUUID(),
          from: {
            name: 'Brian Hughes',
            email: 'hughes.brian@company.com',
            avatar: 'images/photos/male-02.jpg',
          },
          to: value.to,
          subject: value.subject,
          body: value.body.split('\n\n'),
          date: formatISO(new Date()),
          read: true,
          starred: false,
          folder: 'sent',
          labels: [],
          attachments: [],
        },
      ]);

      this.dialogRef.close();
    });
  }
}
