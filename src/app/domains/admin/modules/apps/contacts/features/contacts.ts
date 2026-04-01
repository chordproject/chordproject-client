import { I18nPluralPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput, MatPrefix } from '@angular/material/input';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { ContactsService } from '@/app/domains/admin/modules/apps/contacts/data/contacts';
import { Contact } from '@/app/domains/admin/modules/apps/contacts/data/model';

@Component({
  selector: 'contacts',
  imports: [
    I18nPluralPipe,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatFormField,
    MatInput,
    MatPrefix,
  ],
  host: {
    class: 'lg:h-[calc(1dvh-57px)]',
  },
  template: `
    <div
      class="@container mx-auto flex w-full flex-auto flex-col overflow-hidden"
    >
      <mat-sidenav-container
        class="h-full flex-auto [&_.mat-drawer-backdrop]:fixed"
        (backdropClick)="closeContact()"
      >
        <!-- Drawer -->
        <mat-sidenav
          class="w-full bg-white sm:w-lg dark:bg-neutral-900"
          [mode]="isMobile() ? 'over' : 'side'"
          [opened]="!!selectedContact()"
          [position]="'end'"
          [fixedInViewport]="isMobile()"
          disableClose
        >
          <router-outlet></router-outlet>
        </mat-sidenav>

        <mat-sidenav-content
          class="flex flex-auto flex-col"
          [class.border-r]="!!selectedContact()"
        >
          <!-- Header -->
          <div class="flex items-center gap-x-4 px-6 py-4 lg:px-10 lg:py-8">
            <div class="flex flex-col gap-y-0.5">
              <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
                Contacts
              </div>
              <div class="text-neutral-500">
                {{
                  data.contacts.length
                    | i18nPlural
                      : {
                          '=0': 'No contacts',
                          '=1': '1 contact',
                          other: '# contacts',
                        }
                }}
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
                placeholder="Search contacts"
                matInput
              />
            </mat-form-field>

            <!-- Actions -->
            <button matButton="filled">
              <mat-icon svgIcon="plus" />
              Add
            </button>
          </div>

          <!-- Tasks -->
          <div class="relative">
            @if (contacts && data.contacts.length > 0) {
              @for (contact of contacts; track contact.id; let i = $index) {
                <!-- Group -->
                @if (
                  i === 0 ||
                  contact.name.charAt(0) !== contacts[i - 1].name.charAt(0)
                ) {
                  <div
                    class="-mt-px border-t border-b bg-neutral-50 px-6 py-1 font-medium text-neutral-500 uppercase md:px-8 dark:bg-neutral-900"
                  >
                    {{ contact.name.charAt(0) }}
                  </div>
                }
                <!-- Contact -->
                <a
                  class="flex cursor-pointer items-center border-b px-6 py-4 hover:bg-neutral-100 md:px-8 dark:hover:bg-white/2.5"
                  [routerLink]="['./', contact.id]"
                >
                  @if (contact.photo) {
                    <img
                      class="size-10 shrink-0 rounded-full object-cover"
                      [src]="contact.photo"
                      alt="Contact avatar"
                    />
                  }
                  @if (!contact.photo) {
                    <div
                      class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-lg text-neutral-600 uppercase dark:bg-neutral-700 dark:text-neutral-200"
                    >
                      {{ contact.name.charAt(0) }}
                    </div>
                  }
                  <div class="ml-4 min-w-0">
                    <div class="truncate leading-5 font-medium">
                      {{ contact.name }}
                    </div>
                    <div class="truncate leading-5 text-neutral-500">
                      {{ contact.title }}
                    </div>
                  </div>
                </a>
              }
            } @else {
              <div class="flex flex-auto flex-col items-center justify-center">
                <mat-icon
                  class="size-12 text-neutral-500"
                  svgIcon="user"
                />
                <div class="mt-4 text-xl font-medium tracking-tight">
                  No contacts!
                </div>
              </div>
            }
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
})
export default class Contacts {
  // Dependencies
  private contactsService = inject(ContactsService);
  private media = inject(Media);
  private router = inject(Router);

  // State
  protected data = this.contactsService.data;
  protected contacts = this.data.contacts.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  selectedContact = signal<Contact | null>(null);

  closeContact() {
    const selectedContact = this.selectedContact();
    if (selectedContact) {
      this.selectedContact.set(null);
      this.router.navigate(['/admin/contacts']);
    }
  }
}
