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
  ],
  template: `
    <mat-sidenav-container class="flex-auto">
      <mat-sidenav
        class="w-64"
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        [disableClose]="!isMobile()"
        fixedInViewport
        #sidenav="matSidenav"
      >
        <admin-sidebar />
      </mat-sidenav>

      <mat-sidenav-content
        class="overflow-hidden lg:my-2 lg:mr-2 lg:rounded-xl lg:border lg:shadow-xs"
      >
        <div class="flex flex-auto flex-col">
          <!-- Banner -->
          <div class="w-full bg-emerald-600 p-5 font-medium text-white">
            Want more?
            <a
              class="underline underline-offset-2"
              href="https://builderkit.dev?utm_source=fuse&utm_medium=banner&utm_campaign=fuse50"
            >
              Check out BuilderKit, the next generation of toolkit for building
              beautiful Angular applications.
            </a>
            Use promo code
            <span class="rounded-lg bg-emerald-300 px-2 py-1 text-emerald-950"
              >FUSE50</span
            >
            for 50% off your purchase!
          </div>

          <!-- Header -->
          <div class="flex items-center px-4 py-3 lg:hidden">
            <button
              matIconButton
              (click)="sidenav.toggle()"
            >
              <mat-icon svgIcon="panel-left" />
            </button>

            <!-- Spacer -->
            <div class="flex-auto"></div>

            <div class="flex items-center gap-x-2">
              <notifications />
              <scheme-switcher />
            </div>
          </div>

          <!-- Content -->
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
