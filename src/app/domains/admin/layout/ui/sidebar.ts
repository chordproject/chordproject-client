import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { UserService } from '@/app/core/user/user.service';
import { Navigation } from '@/app/domains/admin/layout/ui/navigation';
import { User } from '@/app/domains/admin/layout/ui/user';
import { environment } from 'environments/environment';

@Component({
  selector: 'admin-sidebar',
  imports: [MatIcon, Navigation, RouterLink, TranslocoModule, User],
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

    <!-- Sign in / Sign up -->
    @if (!isAuthenticated()) {
      <div class="flex flex-col gap-y-1 px-4 pb-2">
        <a
          routerLink="/auth/sign-in"
          class="flex cursor-pointer items-center gap-x-2 rounded-lg px-2.5 py-2 font-medium select-none hover:bg-neutral-700/10 dark:hover:bg-neutral-300/10"
        >
          <mat-icon class="size-4" svgIcon="log-in" />
          {{ 'nav.sign_in' | transloco }}
        </a>
        <a
          routerLink="/auth/sign-up"
          class="flex cursor-pointer items-center gap-x-2 rounded-lg px-2.5 py-2 font-medium select-none hover:bg-neutral-700/10 dark:hover:bg-neutral-300/10"
        >
          <mat-icon class="size-4" svgIcon="log-out" />
          {{ 'nav.sign_up' | transloco }}
        </a>
      </div>
    }

    <!-- Footer -->
    <div class="p-2">
      <user />
    </div>
  `,
})
export class AdminSidebar {
  protected readonly brand = environment.brand;

  private userService = inject(UserService);
  protected isAuthenticated = toSignal(this.userService.isAuthenticated(), {
    initialValue: false,
  });
}
