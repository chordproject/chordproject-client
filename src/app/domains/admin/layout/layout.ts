import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { Assistant } from '@/app/domains/admin/layout/ui/assistant';
import { LanguageSwitcher } from '@/app/domains/admin/layout/ui/language-switcher';
import { Notifications } from '@/app/domains/admin/layout/ui/notifications';
import { SchemeSwitcher } from '@/app/domains/admin/layout/ui/scheme-switcher';
import { Shortcuts } from '@/app/domains/admin/layout/ui/shortcuts';
import { AdminSidebar } from '@/app/domains/admin/layout/ui/sidebar';

@Component({
  selector: 'admin-layout',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    AdminSidebar,
    SchemeSwitcher,
    Notifications,
    LanguageSwitcher,
    Shortcuts,
    Assistant,
    MatDivider,
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav
        class="w-70 border-r border-neutral-200 scheme-dark dark:border-neutral-800 dark:bg-neutral-900 print:hidden"
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        [disableClose]="!isMobile()"
        fixedInViewport
        #sidenav="matSidenav"
      >
        <admin-sidebar />
      </mat-sidenav>

      <mat-sidenav-content
        class="flex flex-col lg:h-dvh lg:overflow-hidden print:ml-0! print:h-auto print:overflow-visible"
      >
        <!-- Banner -->
        <div
          class="relative isolate w-full bg-emerald-600 px-6 py-4 font-medium text-white print:hidden"
        >
          <a
            class="absolute inset-0 z-10"
            href="https://builderkit.dev?utm_source=angular-material.fusetheme.com&utm_medium=banner&utm_campaign=fuse"
            target="_blank"
            ><span></span
          ></a>
          Check out BuilderKit; the next generation of toolkit for building
          beautiful Angular applications. Use promo code
          <span
            class="rounded-lg bg-emerald-300 px-1.5 py-0.5 text-base font-semibold text-emerald-950"
            >FUSE</span
          >
          on checkout for
          <span class="underline underline-offset-2">20%</span> off your
          purchase!
        </div>

        <!-- Toolbar -->
        <div class="flex items-center border-b px-4 py-2.5 print:hidden">
          <button
            matIconButton
            (click)="sidenav.toggle()"
          >
            <mat-icon svgIcon="panel-left" />
          </button>

          <!-- Separator -->
          <div class="mx-3 h-5 border-l"></div>

          <shortcuts />

          <!-- Spacer -->
          <div class="flex-auto"></div>

          <div class="flex items-center gap-x-2">
            <language-switcher />
            <scheme-switcher />
            <notifications />
            <mat-divider
              vertical
              class="mx-1 h-5"
            />
            <assistant />
          </div>
        </div>

        <!-- Content -->
        <div
          class="flex flex-col lg:min-h-0 lg:flex-auto lg:overflow-auto print:overflow-visible"
        >
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class AdminLayout {
  // Dependencies
  private media = inject(Media);

  // State
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
}
