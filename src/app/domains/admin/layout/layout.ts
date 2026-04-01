import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { LanguageSwitcher } from '@/app/domains/admin/layout/ui/language-switcher';
import { Notifications } from '@/app/domains/admin/layout/ui/notifications';
import { SchemeSwitcher } from '@/app/domains/admin/layout/ui/scheme-switcher';
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
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav
        class="w-70 border-r border-neutral-200 scheme-dark dark:border-neutral-800 dark:bg-neutral-900"
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        [disableClose]="!isMobile()"
        fixedInViewport
        #sidenav="matSidenav"
      >
        <admin-sidebar />
      </mat-sidenav>

      <mat-sidenav-content>
        <!-- Banner -->
        <div
          class="relative w-full bg-emerald-600 px-6 py-4 font-medium text-white"
        >
          <a
            class="absolute inset-0 z-10"
            href="https://builderkit.dev?utm_source=fuse&utm_medium=banner&utm_campaign=upgrade"
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
        <div class="flex items-center border-b px-4 py-2.5">
          <button
            matIconButton
            (click)="sidenav.toggle()"
          >
            <mat-icon svgIcon="panel-left" />
          </button>

          <!-- Spacer -->
          <div class="flex-auto"></div>

          <div class="flex items-center gap-x-2">
            <language-switcher />
            <scheme-switcher />
            <notifications />
          </div>
        </div>

        <!-- Content -->
        <router-outlet />
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
