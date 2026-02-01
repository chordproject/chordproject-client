import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/list';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'notifications-settings',
  imports: [FormsModule, MatButton, MatDivider, MatSlideToggle, FormField],
  template: `
    <form
      class="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8"
      (submit)="save($event)"
    >
      <!-- Alerts section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Alerts</div>
      </div>

      <!-- Communication -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="notificationsSettingsForm.communication"
      >
        <div class="ml-2 flex flex-col">
          <div class="font-medium">Communication</div>
          <div class="text-sm text-neutral-500">
            Get news, announcements, and product updates.
          </div>
        </div>
      </mat-slide-toggle>

      <!-- Security -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="notificationsSettingsForm.security"
      >
        <div class="ml-2 flex flex-col">
          <div class="font-medium">Security</div>
          <div class="text-sm text-neutral-500">
            Get important notifications about your account security.
          </div>
        </div>
      </mat-slide-toggle>

      <!-- Meetups -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="notificationsSettingsForm.meetups"
      >
        <div class="ml-2 flex flex-col">
          <div class="font-medium">Meetups</div>
          <div class="text-sm text-neutral-500">
            Get an email when a Meetup is posted close to my location.
          </div>
        </div>
      </mat-slide-toggle>

      <!-- Divider -->
      <mat-divider class="col-span-full my-4" />

      <!-- Account activity section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Email me when:</div>
      </div>

      <!-- Comments -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="notificationsSettingsForm.comments"
      >
        <div class="ml-2 flex flex-col">
          someone comments on one of my items
        </div>
      </mat-slide-toggle>

      <!-- Mention -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="notificationsSettingsForm.mention"
      >
        <div class="ml-2 flex flex-col">someone mentions me</div>
      </mat-slide-toggle>

      <!-- Follow -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="notificationsSettingsForm.follow"
      >
        <div class="ml-2 flex flex-col">someone follows me</div>
      </mat-slide-toggle>

      <!-- Inquiry -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="notificationsSettingsForm.inquiry"
      >
        <div class="ml-2 flex flex-col">someone replies to my job posting</div>
      </mat-slide-toggle>

      <!-- Divider -->
      <mat-divider class="col-span-full my-4" />

      <!-- Actions -->
      <div class="col-span-full flex items-center justify-end gap-x-4">
        <button
          type="button"
          matButton="outlined"
        >
          Cancel
        </button>
        <button matButton="filled">Save</button>
      </div>
    </form>
  `,
})
export default class NotificationsSettings {
  // State
  protected notificationsSettingsModel = signal({
    communication: true,
    security: true,
    meetups: false,
    comments: false,
    mention: true,
    follow: true,
    inquiry: true,
  });
  protected notificationsSettingsForm = form(this.notificationsSettingsModel);

  save(event: Event) {
    event.preventDefault();
  }
}
