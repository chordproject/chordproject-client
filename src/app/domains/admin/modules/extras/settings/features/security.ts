import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, required, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  MatError,
  MatFormField,
  MatHint,
  MatInput,
  MatLabel,
  MatPrefix,
} from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'security-settings',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatPrefix,
    MatSlideToggle,
    MatDivider,
    FormField,
    MatHint,
    MatError,
  ],
  template: `
    <form
      class="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8"
      (submit)="save($event)"
    >
      <!-- Password section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Change your password</div>
        <div class="text-neutral-500">
          You can only change your password twice within 24 hours.
        </div>
      </div>

      <!-- Current password -->
      <mat-form-field class="col-span-full md:col-span-3">
        <mat-label>Current password</mat-label>
        <input
          type="password"
          matInput
          [formField]="securitySettingsForm.currentPassword"
        />
        <mat-icon
          svgIcon="lock-keyhole"
          matPrefix
        ></mat-icon>
        <mat-error>
          @for (
            error of securitySettingsForm.currentPassword().errors();
            track error
          ) {
            {{ error.message }}
          }
        </mat-error>
      </mat-form-field>

      <!-- New password -->
      <mat-form-field class="col-span-full md:col-span-3">
        <mat-label>New password</mat-label>
        <input
          type="password"
          matInput
          [formField]="securitySettingsForm.newPassword"
        />
        <mat-icon
          svgIcon="lock-keyhole"
          matPrefix
        ></mat-icon>
        <mat-hint>
          Minimum 8 characters. Must include numbers, letters and special
          characters.
        </mat-hint>
      </mat-form-field>

      <!-- Confirm new password -->
      <mat-form-field class="col-span-full md:col-span-3">
        <mat-label>Confirm new password</mat-label>
        <input
          type="password"
          matInput
          [formField]="securitySettingsForm.confirmNewPassword"
        />
        <mat-icon
          svgIcon="lock-keyhole"
          matPrefix
        ></mat-icon>
        <mat-error>
          @for (
            error of securitySettingsForm.confirmNewPassword().errors();
            track error
          ) {
            {{ error.message }}
          }
        </mat-error>
      </mat-form-field>

      <!-- Divider -->
      <mat-divider class="col-span-full my-4" />

      <!-- Security preferences section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Security preferences</div>
        <div class="text-neutral-500">
          Keep your account more secure with following preferences.
        </div>
      </div>

      <!-- Two-step auth -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="securitySettingsForm.twoStep"
      >
        <div class="ml-2 flex flex-col">
          <div class="font-medium">Enable two-step authentication</div>
          <div class="text-sm text-neutral-500">
            Protects you against password theft by requesting an authentication
            code via SMS on every login.
          </div>
        </div>
      </mat-slide-toggle>

      <!-- Ask to change password -->
      <mat-slide-toggle
        class="col-span-full"
        [formField]="securitySettingsForm.askPasswordChange"
      >
        <div class="ml-2 flex flex-col">
          <div class="font-medium">
            Ask to change password on every 6 months
          </div>
          <div class="text-sm text-neutral-500">
            A simple but an effective way to be protected against data leaks and
            password theft.
          </div>
        </div>
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
export default class SecuritySettings {
  // State
  protected securitySettingsModel = signal({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    twoStep: true,
    askPasswordChange: false,
  });
  protected securitySettingsForm = form(
    this.securitySettingsModel,
    (schema) => {
      // Require current password when new password and confirm password are set
      required(schema.currentPassword, {
        when: ({ valueOf }) =>
          valueOf(schema.newPassword) !== '' &&
          valueOf(schema.confirmNewPassword) !== '',
        message: 'Current password is required to change password.',
      });

      // Require confirm new password when new password is set
      required(schema.confirmNewPassword, {
        when: ({ valueOf }) => valueOf(schema.newPassword) !== '',
        message: 'Please confirm your new password.',
      });

      // Match new password and confirm new password
      validate(schema.confirmNewPassword, ({ value, valueOf }) => {
        const confirmPassword = value();
        const password = valueOf(schema.newPassword);

        if (confirmPassword !== password) {
          return {
            kind: 'passwordMismatch',
            message: 'New password and confirmation do not match.',
          };
        }

        return null;
      });
    }
  );

  save(event: Event) {
    event.preventDefault();
  }
}
