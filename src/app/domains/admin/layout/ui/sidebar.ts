import { Component } from '@angular/core';
import { Navigation } from '@/app/domains/admin/layout/ui/navigation';
import { User } from '@/app/domains/admin/layout/ui/user';

@Component({
  selector: 'admin-sidebar',
  imports: [Navigation, User],
  host: {
    class: 'flex w-full flex-auto flex-col',
  },
  template: `
    <!-- Header -->
    <div class="relative flex items-center pt-5 pr-4 pb-0 pl-6">
      <!-- Logo -->
      <img
        src="/chp/logo/logo-text-light.svg"
        class="h-auto w-full"
        alt="ChordProject"
      />
    </div>

    <!-- Navigation -->    <navigation class="mt-8 mb-4 flex-auto" />

    <!-- Spacer -->
    <div class="flex-auto"></div>

    <!-- Footer -->
    <div class="p-2">
      <user />
    </div>
  `,
})
export class AdminSidebar {}
