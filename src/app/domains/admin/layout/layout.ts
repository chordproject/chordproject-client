import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Media } from '@/app/core/media';
import { GithubLink } from '@/app/domains/admin/layout/ui/github-link';
import { LanguageSwitcher } from '@/app/domains/admin/layout/ui/language-switcher';
import { SchemeSwitcher } from '@/app/domains/admin/layout/ui/scheme-switcher';
import { AdminSidebar } from '@/app/domains/admin/layout/ui/sidebar';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { environment } from 'environments/environment';

@Component({
  selector: 'admin-layout',
  imports: [
    MatIconModule,
    MatButtonModule,
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    RouterLink,
    AdminSidebar,
    SchemeSwitcher,
    LanguageSwitcher,
    GithubLink,
    SearchComponent,
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav
        class="w-64 border-r border-neutral-200 scheme-dark dark:border-neutral-800 dark:bg-neutral-900 print:hidden"
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        [disableClose]="!isMobile()"
        fixedInViewport
        #sidenav="matSidenav"
      >
        <admin-sidebar />
      </mat-sidenav>

      <mat-sidenav-content
        class="flex h-dvh flex-col overflow-hidden print:ml-0! print:h-auto print:overflow-visible"
      >
        <!-- Toolbar -->
        <div class="relative flex items-center border-b px-4 py-2.5 print:hidden">
          @if (isMobile() && !sidenav.opened) {
            <a
              [routerLink]="['/home']"
              class="mr-3 inline-flex items-center"
              [attr.aria-label]="brand === 'hj' ? 'HomenaJesus' : 'ChordProject'"
            >
              <img
                [src]="'/' + brand + '/logo/logo.svg'"
                [alt]="brand === 'hj' ? 'HomenaJesus' : 'ChordProject'"
                class="size-7"
              />
            </a>
          }

          <button
            matIconButton
            (click)="sidenav.toggle()"
          >
            <mat-icon svgIcon="panel-left" />
          </button>

          @if (!isHome()) {
            <search [appearance]="'bar'"></search>
          }

          <!-- Spacer -->
          <div class="flex-auto"></div>

          <div class="flex items-center gap-x-2">
            <language-switcher />
            <scheme-switcher />
            <github-link />
          </div>
        </div>

        <!-- Content -->
        <div
          class="relative flex min-h-0 flex-auto flex-col overflow-auto print:overflow-visible"
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
  private router = inject(Router);
  protected readonly brand = environment.brand;

  // State
  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  protected isHome = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects.startsWith('/home'))
    ),
    { initialValue: this.router.url.startsWith('/home') }
  );
}
