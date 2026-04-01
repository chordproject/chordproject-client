import { DatePipe } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '@/app/domains/admin/modules/apps/contacts/data/contacts';
import Contacts from '@/app/domains/admin/modules/apps/contacts/features/contacts';

@Component({
  selector: 'contact',
  imports: [DatePipe, MatIcon, MatIconButton, MatTooltip, ReactiveFormsModule],
  template: `
    @let contact = this.contact();
    <div class="flex w-full flex-col">
      <!-- Header -->
      <div
        class="relative h-40 w-full bg-neutral-100 px-8 sm:h-48 sm:px-8 dark:bg-neutral-800"
      >
        <!-- Background -->
        @if (contact.background) {
          <img
            class="absolute inset-0 h-full w-full object-cover"
            [src]="contact.background"
            alt="Contact background"
          />
        }
        <!-- Close button -->
        <div
          class="mx-auto flex w-full max-w-3xl items-center justify-end pt-6"
        >
          <button
            matIconButton
            class="bg-white/20 text-black backdrop-blur-xs"
            [matTooltip]="'Close'"
            (click)="closeContact()"
          >
            <mat-icon svgIcon="x"></mat-icon>
          </button>
        </div>
      </div>

      <!-- Contact -->
      <div
        class="relative flex flex-auto flex-col items-center p-6 pt-0 sm:p-12 sm:pt-0"
      >
        <div class="w-full max-w-3xl">
          <!-- Photo -->
          <div class="-mt-16 flex flex-auto items-end">
            <div
              class="overflow-hidden rounded-full ring-4 ring-white dark:ring-neutral-900"
            >
              @if (contact.photo) {
                <img
                  class="size-32 shrink-0 object-cover"
                  [src]="contact.photo"
                  alt="Contact photo"
                />
              }
              @if (!contact.photo) {
                <div
                  class="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded bg-neutral-200 text-5xl font-bold text-neutral-600 uppercase dark:bg-neutral-700 dark:text-neutral-200"
                >
                  {{ contact.name.charAt(0) }}
                </div>
              }
            </div>
          </div>

          <!-- Name -->
          <div class="mt-3 truncate text-4xl font-bold">
            {{ contact.name }}
          </div>

          <div class="mt-8 flex flex-col space-y-8">
            <!-- Title -->
            @if (contact.title) {
              <div class="flex items-center">
                <mat-icon
                  class="shrink-0"
                  svgIcon="briefcase"
                />
                <div class="ml-6">
                  {{ contact.title }}
                </div>
              </div>
            }

            <!-- Company -->
            @if (contact.company) {
              <div class="flex items-center">
                <mat-icon
                  class="shrink-0"
                  svgIcon="building"
                />
                <div class="ml-6">
                  {{ contact.company }}
                </div>
              </div>
            }

            <!-- Emails -->
            @if (contact.emails.length) {
              <div class="flex">
                <mat-icon
                  class="shrink-0"
                  svgIcon="mail"
                />
                <div class="ml-6 flex flex-col space-y-1 gap-y-2">
                  @for (email of contact.emails; track email.email) {
                    <div class="flex items-center">
                      <a
                        class="text-primary-500 hover:underline"
                        [href]="'mailto:' + email.email"
                        target="_blank"
                      >
                        {{ email.email }}
                      </a>
                      @if (email.label) {
                        <div class="truncate text-neutral-500">
                          <span class="mx-2">&bull;</span>
                          <span class="font-medium">{{ email.label }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Phone -->
            @if (contact.phoneNumbers.length) {
              <div class="flex">
                <mat-icon
                  class="shrink-0"
                  svgIcon="phone"
                />
                <div class="ml-6 flex flex-col space-y-1 gap-y-2">
                  @for (
                    phoneNumber of contact.phoneNumbers;
                    track phoneNumber.phoneNumber
                  ) {
                    <div class="flex items-center">
                      <div class="tabular-nums">
                        {{ phoneNumber.phoneNumber }}
                      </div>
                      @if (phoneNumber.label) {
                        <div class="truncate text-neutral-500">
                          <span class="mx-2">&bull;</span>
                          <span class="font-medium">{{
                            phoneNumber.label
                          }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Address -->
            @if (contact.address) {
              <div class="flex items-center">
                <mat-icon
                  class="shrink-0"
                  svgIcon="map-pin"
                />
                <div class="ml-6">
                  {{ contact.address }}
                </div>
              </div>
            }

            <!-- Birthday -->
            @if (contact.birthday) {
              <div class="flex items-center">
                <mat-icon
                  class="shrink-0"
                  svgIcon="cake"
                />
                <div class="ml-6">
                  {{ contact.birthday | date: 'longDate' }}
                </div>
              </div>
            }

            <!-- Notes -->
            @if (contact.notes) {
              <div class="flex">
                <mat-icon
                  class="shrink-0"
                  svgIcon="notebook-pen"
                />
                <div
                  class="prose ml-6 text-base leading-5 *:first:mt-0"
                  [innerHTML]="contact.notes"
                ></div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class Contact {
  // Dependencies
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private contactsService = inject(ContactsService);
  private contacts = inject(Contacts);

  // Input / Output
  readonly contactId = input.required({ alias: 'id' });

  // State
  protected data = this.contactsService.data;
  protected contact = computed(
    () => this.data.contacts.find((contact) => contact.id === this.contactId())!
  );

  constructor() {
    afterNextRender(() => {
      this.contacts.selectedContact.set(this.contact());
    });
  }

  closeContact() {
    this.contacts.selectedContact.set(null);
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
