import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { SchemeSwitcher } from '@/app/domains/admin/layout/ui/scheme-switcher';

@Component({
  selector: 'auth-layout',
  imports: [MatIcon, RouterLink, RouterOutlet, SchemeSwitcher, TranslocoModule],
  template: `
    <a
      class="fixed left-4 top-4 z-50 inline-flex min-h-10 items-center gap-2 rounded-md bg-black/35 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-black/55 sm:left-6 sm:top-6"
      routerLink="/home"
    >
      <mat-icon class="size-4" svgIcon="arrow-left"></mat-icon>
      {{ 'auth.back_to_home' | transloco }}
    </a>
    <div class="fixed right-4 top-4 z-50 rounded-md bg-black/35 text-white backdrop-blur sm:right-6 sm:top-6">
      <scheme-switcher />
    </div>
    <router-outlet></router-outlet>
  `,
})
export default class AuthLayout {}
