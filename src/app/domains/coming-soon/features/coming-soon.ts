import { Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'coming-soon',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormField,
    MatCard,
  ],
  template: `
    <div class="flex flex-auto items-center justify-center p-4 sm:p-12">
      <mat-card class="flex flex-row">
        <div class="flex w-full max-w-md flex-col p-8 sm:p-12">
          <!-- Logo -->
          <img
            class="w-12"
            src="/images/logo/logo.svg"
            alt="Fuse logo"
          />

          <!-- Title -->
          <div
            class="leading-tight mt-8 text-4xl font-extrabold tracking-tight"
          >
            Almost there!
          </div>
          <div class="mt-0.5 font-medium">
            Do you want to be notified when we are ready? Register below so we
            can notify you about the launch!
          </div>

          <!-- Alert -->
          @if (isRegistered()) {
            <div
              class="mt-8 rounded-lg bg-green-200 p-4 text-green-700 dark:bg-green-800 dark:text-green-50"
            >
              Thank you for registering! We will notify you when we launch.
            </div>
          }

          <!-- Coming soon form -->
          <form
            class="mt-8"
            (submit)="register($event)"
          >
            <!-- Email field -->
            <mat-form-field class="w-full">
              <mat-label>Email address</mat-label>
              <input
                id="email"
                matInput
                [formField]="comingSoonForm.email"
              />
              <mat-error>
                @if (
                  comingSoonForm.email().touched() &&
                  comingSoonForm.email().invalid()
                ) {
                  @for (error of comingSoonForm.email().errors(); track error) {
                    {{ error.message }}
                  }
                }
              </mat-error>
            </mat-form-field>

            <!-- Submit button -->
            <button
              type="submit"
              matButton="filled"
              class="mt-6 w-full"
              [disabledInteractive]="isLoading()"
            >
              @if (isLoading()) {
                <mat-progress-spinner
                  class="[--mat-progress-spinner-active-indicator-color:var(--color-white)]"
                  mode="indeterminate"
                  [diameter]="24"
                />
              } @else {
                Notify me when you launch
              }
            </button>

            <!-- Form footer -->
            <div class="mt-8 text-sm text-neutral-500">
              This isn't a newsletter subscription. We will send one email to
              you when we launch and then you will be removed from the list.
            </div>
          </form>
        </div>

        <div
          class="relative hidden flex-auto items-center justify-center overflow-hidden rounded-r-xl border-l bg-neutral-950 p-8 sm:p-16 md:flex"
        >
          <!-- Background -->
          <!-- Rings -->
          <!-- prettier-ignore -->
          <svg class="absolute inset-0 pointer-events-none"
               viewBox="0 0 960 540" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
            <g class="text-gray-700 opacity-25" fill="none" stroke="currentColor" stroke-width="100">
              <circle r="234" cx="196" cy="23"></circle>
              <circle r="234" cx="790" cy="491"></circle>
            </g>
          </svg>
          <!-- Dots -->
          <!-- prettier-ignore -->
          <svg class="absolute -top-16 -right-16 text-gray-700"
               viewBox="0 0 220 192" width="220" height="192" fill="none">
            <defs>
              <pattern id="837c3e70-6c3a-44e6-8854-cc48c737b659" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" fill="currentColor"></rect>
              </pattern>
            </defs>
            <rect width="220" height="192" fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"></rect>
          </svg>
          <!-- Content -->
          <div class="relative z-10 w-full max-w-2xl">
            <div class="text-5xl font-bold text-white">
              Welcome to our community
            </div>
            <div class="text-medium mt-6 text-xl text-neutral-500">
              Fuse helps developers to build organized and well coded dashboards
              full of beautiful and rich modules. Join us and start building
              your application today.
            </div>
            <div class="mt-12 flex items-center">
              <div class="flex shrink-0 items-center -space-x-1.5">
                <img
                  class="h-10 w-10 rounded-full object-cover ring-1"
                  src="/images/photos/female-18.jpg"
                  alt="Avatar image"
                />
                <img
                  class="h-10 w-10 rounded-full object-cover ring-1"
                  src="/images/photos/female-11.jpg"
                  alt="Avatar image"
                />
                <img
                  class="h-10 w-10 rounded-full object-cover ring-1"
                  src="/images/photos/male-09.jpg"
                  alt="Avatar image"
                />
                <img
                  class="h-10 w-10 rounded-full object-cover ring-1"
                  src="/images/photos/male-16.jpg"
                  alt="Avatar image"
                />
              </div>
              <div class="ml-4 font-medium tracking-tight text-neutral-500">
                More than 17k people joined us, it's your turn
              </div>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
})
export default class ComingSoon {
  // State
  protected isRegistered = signal(false);
  protected isLoading = signal(false);

  protected comingSoonFormModel = signal({
    email: '',
  });
  protected comingSoonForm = form(this.comingSoonFormModel, (form) => {
    required(form.email, { message: 'Email address is required' });
    email(form.email, { message: 'Please enter a valid email address' });
  });

  register(event: Event) {
    event.preventDefault();

    this.isRegistered.set(false);
    this.isLoading.set(true);

    // Do the registration logic here (e.g., send the email to the server)

    setTimeout(() => {
      // Simulate a successful registration after a short delay
      this.isRegistered.set(true);

      // Reset the form
      this.comingSoonForm().reset({ email: '' });

      // Stop loading
      this.isLoading.set(false);
    }, 1500);
  }
}
