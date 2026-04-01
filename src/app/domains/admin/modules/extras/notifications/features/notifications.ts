import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'notifications',
  imports: [MatButton, RouterLink, MatIcon],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-5xl flex-auto flex-col gap-4 p-6 sm:gap-8 lg:p-10"
    >
      <!-- Header -->
      <div class="flex flex-col justify-between gap-y-0.5">
        <div class="text-xl font-semibold tracking-tighter sm:text-2xl">
          Notifications
        </div>

        <div class="font-medium text-neutral-500">
          Application wide activities are listed here as individual items,
          starting with the most recent.
        </div>
      </div>

      <!-- Timeline -->
      <div class="flex flex-col gap-y-16">
        <!-- Section -->
        <div class="flex flex-col items-start">
          <div
            class="mb-8 rounded-md bg-primary-600 px-3 py-1.5 text-md font-medium text-white"
          >
            Yesterday
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4 pb-12">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="star"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                Your submission has been accepted
              </div>
              <div class="text-neutral-500">Mar 31, 7:30 PM</div>
              <div
                class="mt-4 flex flex-col gap-y-2 rounded-md bg-neutral-100 px-4 py-3"
              >
                <p class="font-medium">
                  Congratulations! Your submission has been accepted.
                </p>
                <p>
                  Hello Brian, we are pleased to inform you that your submission
                  has been accepted. Let us know if you have any questions or
                  need further assistance.
                </p>
              </div>
            </div>
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4 pb-12">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="star"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                Leo Gill added you to Top Secret Project group and assigned you
                as a Project Manager
              </div>
              <div class="text-neutral-500">Mar 31, 7:05 PM</div>
            </div>
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4 pb-12">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="mail"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                You have 15 unread mails across 3 mailboxes
              </div>
              <div class="text-neutral-500">Mar 31, 4:55 PM</div>
            </div>
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="box"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                Your container is ready to publish
              </div>
              <div class="text-neutral-500">Mar 31, 2:55 PM</div>
            </div>
          </div>
        </div>

        <!-- Section -->
        <div class="flex flex-col items-start">
          <div
            class="mb-8 rounded-md bg-primary-600 px-3 py-1.5 text-md font-medium text-white"
          >
            2 days ago
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4 pb-12">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="message-circle"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                Tina Harris started a chat with you
              </div>
              <div class="text-neutral-500">Mar 30, 7:30 PM</div>
            </div>
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="message-circle-dashed"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                Sophie Stone sent you a direct message
              </div>
              <div class="text-neutral-500">Mar 30, 7:05 PM</div>
            </div>
          </div>
        </div>

        <!-- Section -->
        <div class="flex flex-col items-start">
          <div
            class="mb-8 rounded-md bg-primary-600 px-3 py-1.5 text-md font-medium text-white"
          >
            3 days ago
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4 pb-12">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="user-round-check"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                Roger Murray accepted your friend request
              </div>
              <div class="text-neutral-500">Mar 29, 7:05 PM</div>
            </div>
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4 pb-12">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="mail"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                You have 4 unread mails across 2 mailboxes
              </div>
              <div class="text-neutral-500">Mar 29, 4:55 PM</div>
            </div>
          </div>

          <!-- Item -->
          <div class="relative flex gap-x-4">
            <div
              class="absolute inset-y-0 left-5 -z-10 w-0.5 -translate-x-px bg-neutral-200"
            ></div>
            <div
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-500"
            >
              <mat-icon
                class="text-white"
                svgIcon="star"
              />
            </div>
            <div class="flex flex-col">
              <div class="text-md font-medium">
                Your submission has been accepted! Sign-up for the final
                assigment will be ready in 2 days
              </div>
              <div class="text-neutral-500">Mar 29, 2:55 PM</div>
            </div>
          </div>
        </div>

        <!-- Load more -->
        <button matButton="outlined">Load more</button>
      </div>
    </div>
  `,
})
export default class Notifications {}
