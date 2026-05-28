import { Component } from '@angular/core';

@Component({
  selector: 'maintenance',
  template: `
    <div
      class="flex flex-auto flex-col items-center justify-center p-6 text-center sm:p-10"
    >
      <!-- Logo -->
      <img
        class="w-12"
        src="/images/logo/logo.svg"
        alt="Fuse logo"
      />

      <!-- Title -->
      <div class="mt-8 text-4xl font-bold md:text-[64px]/24">
        Hang in there!
      </div>
      <div class="mt-2 font-medium text-neutral-500 md:mt-0 md:text-lg">
        We're currently going through maintenance work. Please check back later.
      </div>
    </div>
  `,
})
export default class Maintenance {}
