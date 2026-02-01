import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
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
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'account-settings',
  imports: [
    CdkTextareaAutosize,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatOption,
    MatPrefix,
    MatSelect,
    FormField,
    MatDivider,
    MatHint,
    MatError,
  ],
  template: `
    <form
      class="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8"
      (submit)="save($event)"
    >
      <!-- Profile section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Profile</div>
        <div class="text-neutral-500">
          Following information is publicly displayed, be careful!
        </div>
      </div>

      <!-- Name -->
      <mat-form-field class="col-span-full md:col-span-2">
        <mat-label>Name</mat-label>
        <input
          matInput
          [formField]="accountSettingsForm.name"
        />
        <mat-icon
          svgIcon="user"
          matPrefix
        ></mat-icon>
        <mat-error>
          @for (error of accountSettingsForm.name().errors(); track error) {
            {{ error.message }}
          }
        </mat-error>
      </mat-form-field>

      <!-- Username -->
      <mat-form-field class="col-span-full md:col-span-2 md:col-start-1">
        <mat-label>Username</mat-label>
        <input
          matInput
          [formField]="accountSettingsForm.username"
        />
        <div
          class="text-neutral-500"
          matPrefix
        >
          fusetheme.com/
        </div>
      </mat-form-field>

      <!-- Title -->
      <mat-form-field class="col-span-full md:col-span-2 md:col-start-1">
        <mat-label>Title</mat-label>
        <input
          matInput
          [formField]="accountSettingsForm.title"
        />
        <mat-icon
          svgIcon="briefcase-business"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Company -->
      <mat-form-field class="col-span-full md:col-span-2">
        <mat-label>Company</mat-label>
        <input
          matInput
          [formField]="accountSettingsForm.company"
        />
        <mat-icon
          svgIcon="building-2"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- About -->
      <mat-form-field class="col-span-full md:col-span-3">
        <mat-label>About</mat-label>
        <textarea
          matInput
          cdkTextareaAutosize
          [formField]="accountSettingsForm.about"
          [cdkAutosizeMinRows]="4"
          [cdkAutosizeMaxRows]="6"
        ></textarea>
        <mat-hint>
          Brief description for your profile. Basic HTML and Emoji are allowed.
        </mat-hint>
      </mat-form-field>

      <!-- Divider -->
      <mat-divider class="col-span-full my-4" />

      <!-- Personal information section -->
      <div class="col-span-full">
        <div class="text-lg font-medium">Personal Information</div>
        <div class="text-neutral-500">
          Communication details in case we want to connect with you. These will
          be kept private.
        </div>
      </div>

      <!-- Email -->
      <mat-form-field class="col-span-full md:col-span-2">
        <mat-label>Email</mat-label>
        <input
          matInput
          [formField]="accountSettingsForm.email"
        />
        <mat-icon
          svgIcon="mail"
          matPrefix
        ></mat-icon>
        <mat-error>
          @for (error of accountSettingsForm.email().errors(); track error) {
            {{ error.message }}
          }
        </mat-error>
      </mat-form-field>

      <!-- Phone -->
      <mat-form-field class="col-span-full md:col-span-2">
        <mat-label>Phone</mat-label>
        <input
          matInput
          [formField]="accountSettingsForm.phone"
        />
        <mat-icon
          svgIcon="phone"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Country -->
      <mat-form-field class="col-span-full md:col-span-2">
        <mat-label>Country</mat-label>
        <mat-select [formField]="accountSettingsForm.country">
          <mat-option [value]="'usa'">United States</mat-option>
          <mat-option [value]="'canada'">Canada</mat-option>
          <mat-option [value]="'mexico'">Mexico</mat-option>
          <mat-option [value]="'france'">France</mat-option>
          <mat-option [value]="'germany'">Germany</mat-option>
          <mat-option [value]="'italy'">Italy</mat-option>
        </mat-select>
        <mat-icon
          svgIcon="map-pin"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Language -->
      <mat-form-field class="col-span-full md:col-span-2">
        <mat-label>Language</mat-label>
        <mat-select [formField]="accountSettingsForm.language">
          <mat-option [value]="'english'">English</mat-option>
          <mat-option [value]="'french'">French</mat-option>
          <mat-option [value]="'spanish'">Spanish</mat-option>
          <mat-option [value]="'german'">German</mat-option>
          <mat-option [value]="'italian'">Italian</mat-option>
        </mat-select>
        <mat-icon
          svgIcon="globe"
          matPrefix
        ></mat-icon>
      </mat-form-field>

      <!-- Divider -->
      <mat-divider class="col-span-full my-4" />

      <!-- Actions -->
      <div class="col-span-full flex items-center justify-end gap-x-3">
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
export default class AccountSettings {
  // State
  protected accountSettingsModel = signal({
    name: 'Brian Hughes',
    username: 'brian',
    title: 'Senior Frontend Developer',
    company: 'YXZ Software',
    about:
      "Hey! This is Brian; husband, father and gamer. I'm mostly passionate about bleeding edge tech and chocolate! 🍫",
    email: 'brian@example.com',
    phone: '121-490-33-12',
    country: 'usa',
    language: 'english',
  });
  protected accountSettingsForm = form(this.accountSettingsModel, (schema) => {
    required(schema.name, { message: 'Name is required' });

    required(schema.email, { message: 'Email is required' });
    email(schema.email, { message: 'Invalid email address' });
  });

  save(event: Event) {
    event.preventDefault();
  }
}
