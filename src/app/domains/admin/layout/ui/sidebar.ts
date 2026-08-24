import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navigation } from '@/app/domains/admin/layout/ui/navigation';
import { User } from '@/app/domains/admin/layout/ui/user';
import { environment } from 'environments/environment';

@Component({
  selector: 'admin-sidebar',
  imports: [Navigation, RouterLink, User],
  host: {
    class: 'flex w-full flex-auto flex-col',
  },
  template: `
    <!-- Header -->
    <div class="relative flex items-center pt-5 pr-4 pb-0 pl-6">
      <!-- Logo -->
      <a [routerLink]="['/home']" class="block w-full">
        <img
          [src]="'/' + brand + '/logo/logo-text-light.svg'"
          class="h-auto w-full cursor-pointer"
          [alt]="brand === 'hj' ? 'HomenaJesus' : 'ChordProject'"
        />
      </a>
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
export class AdminSidebar {
  protected readonly brand = environment.brand;
}
