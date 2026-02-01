import { TitleCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';

@Component({
  selector: 'team-settings',
  imports: [
    FormsModule,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatButton,
    MatDivider,
    MatOption,
    MatSelect,
    MatSelectTrigger,
    TitleCasePipe,
  ],
  template: `
    <div class="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8">
      <div class="col-span-full flex items-center gap-x-3">
        <mat-form-field class="flex-auto">
          <input
            matInput
            placeholder="Enter email address"
          />
        </mat-form-field>
        <button matButton="outlined">Invite</button>
      </div>

      <!-- Divider -->
      <mat-divider class="col-span-full" />

      <!-- Team members -->
      @for (member of members; track member.id) {
        <div class="col-span-full flex flex-col sm:flex-row sm:items-center">
          <div class="flex items-center">
            <div
              class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
            >
              @if (member.photo) {
                <img
                  class="size-full object-cover"
                  [src]="member.photo"
                  alt="Member photo"
                />
              }
              @if (!member.photo) {
                <div
                  class="flex size-full items-center justify-center rounded-full bg-gray-200 text-lg text-gray-600 uppercase dark:bg-gray-700 dark:text-gray-200"
                >
                  {{ member.name.charAt(0) }}
                </div>
              }
            </div>
            <div class="ml-4">
              <div class="font-medium">{{ member.name }}</div>
              <div class="text-neutral-500">{{ member.email }}</div>
            </div>
          </div>
          <div class="mt-4 flex items-center sm:mt-0 sm:ml-auto">
            <div class="order-2 ml-4 sm:order-1 sm:ml-0">
              <mat-form-field class="fuse-mat-dense w-32">
                <mat-select
                  [panelClass]="'w-72 min-w-72 max-w-72 h-auto max-h-none'"
                  [value]="member.role"
                  [disableOptionCentering]="true"
                  #roleSelect="matSelect"
                >
                  <mat-select-trigger>
                    <span>Role:</span>
                    <span class="ml-1 font-medium">{{
                      roleSelect.value | titlecase
                    }}</span>
                  </mat-select-trigger>
                  @for (role of roles; track role.value) {
                    <mat-option
                      class="h-auto py-4 leading-none"
                      [value]="role.value"
                    >
                      <div class="font-medium">
                        {{ role.label }}
                      </div>
                      <div
                        class="leading-normal mt-1.5 text-sm whitespace-normal text-neutral-500"
                      >
                        {{ role.description }}
                      </div>
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
            <div class="order-1 sm:order-2 sm:ml-3">
              <button mat-icon-button>
                <mat-icon
                  class="text-neutral-500"
                  svgIcon="trash"
                ></mat-icon>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export default class TeamSettings {
  // State
  protected roles = [
    {
      label: 'Read',
      value: 'read',
      description:
        'Can read and clone this repository. Can also open and comment on issues and pull requests.',
    },
    {
      label: 'Write',
      value: 'write',
      description:
        'Can read, clone, and push to this repository. Can also manage issues and pull requests.',
    },
    {
      label: 'Admin',
      value: 'admin',
      description:
        'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.',
    },
  ];
  protected members = [
    {
      id: '1',
      photo: '/images/photos/male-01.jpg',
      name: 'Dejesus Michael',
      email: 'dejesusmichael@mail.org',
      role: 'admin',
    },
    {
      id: '2',
      photo: '/images/photos/male-03.jpg',
      name: 'Mclaughlin Steele',
      email: 'mclaughlinsteele@mail.me',
      role: 'admin',
    },
    {
      id: '3',
      photo: null,
      name: 'Laverne Dodson',
      email: 'lavernedodson@mail.ca',
      role: 'write',
    },
    {
      id: '4',
      photo: '/images/photos/female-03.jpg',
      name: 'Trudy Berg',
      email: 'trudyberg@mail.us',
      role: 'read',
    },
    {
      id: '5',
      photo: '/images/photos/male-07.jpg',
      name: 'Lamb Underwood',
      email: 'lambunderwood@mail.me',
      role: 'read',
    },
    {
      id: '6',
      photo: '/images/photos/male-08.jpg',
      name: 'Mcleod Wagner',
      email: 'mcleodwagner@mail.biz',
      role: 'read',
    },
    {
      id: '7',
      photo: '/images/photos/female-07.jpg',
      name: 'Shannon Kennedy',
      email: 'shannonkennedy@mail.ca',
      role: 'read',
    },
  ];
}
