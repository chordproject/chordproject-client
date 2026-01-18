import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Media } from '@/app/core/media';
import { LayoutService } from '@/app/domains/admin/layout/data/layout';
// import { navigation } from '@/app/domains/admin/layout/data/navigation';
import { LanguagesComponent } from '@/app/domains/admin/layout/ui/languages/languages.component';
import { MessagesComponent } from '@/app/domains/admin/layout/ui/messages/messages.component';
import { NotificationsComponent } from '@/app/domains/admin/layout/ui/notifications/notifications.component';
import { QuickChatComponent } from '@/app/domains/admin/layout/ui/quick-chat/quick-chat.component';
import { SearchComponent } from '@/app/domains/admin/layout/ui/search/search.component';
import { ShortcutsComponent } from '@/app/domains/admin/layout/ui/shortcuts/shortcuts.component';
import { AdminSidebar } from '@/app/domains/admin/layout/ui/sidebar';
import { FullscreenComponent } from '@/app/shared/components/fullscreen/fullscreen.component';
import FuseSchemeSwitcher from '@/app/shared/components/scheme-switcher/scheme-switcher';
import FuseThemeSwitcher from '@/app/shared/components/theme-switcher/theme-switcher';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';

@Component({
  selector: 'admin-layout',
  imports: [
    FuseLoadingBarComponent,
    FuseVerticalNavigationComponent,
    NotificationsComponent,
    MatIconModule,
    MatButtonModule,
    LanguagesComponent,
    SearchComponent,
    ShortcutsComponent,
    MessagesComponent,
    RouterOutlet,
    QuickChatComponent,
    FuseSchemeSwitcher,
    FuseThemeSwitcher,
    MatDivider,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    FullscreenComponent,
    RouterLink,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    AdminSidebar,
  ],
  template: `
    <mat-sidenav-container class="flex-auto">
      <mat-sidenav
        class="w-64"
        [mode]="isMobile() ? 'over' : 'side'"
        [(opened)]="layoutService.sidebarOpen"
        [disableClose]="!isMobile()"
        fixedInViewport
        #sidenav="matSidenav"
      >
        <admin-sidebar />
      </mat-sidenav>

      <mat-sidenav-content
        class="lg:my-2 lg:mr-2 lg:rounded-xl lg:border lg:shadow-xs"
      >
        <div class="flex flex-auto flex-col">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>

    <div class="flex">
      <!-- Loading bar -->
      <!--<fuse-loading-bar></fuse-loading-bar>-->

      <!-- Navigation -->
      <!--<fuse-vertical-navigation
        class="bg-mat-background text-mat-on-background dark print:hidden"
        [mode]="isScreenSmall() ? 'over' : 'side'"
        [name]="'mainNavigation'"
        [navigation]="navigation"
        [opened]="!isScreenSmall()"
      >
        &lt;!&ndash; Navigation header hook &ndash;&gt;
        <ng-container fuseVerticalNavigationHeader>
          <div class="flex w-full items-center pt-8 pr-4 pb-2 pl-6">
            &lt;!&ndash; Logo &ndash;&gt;
            <div class="flex items-center justify-center">
              <img
                class="w-10"
                src="/images/logo/logo.svg"
                alt="Logo"
              />
              <div class="ml-4 flex flex-col">
                <div
                  class="leading-tight text-[23.6px] font-bold tracking-wide"
                >
                  FUSE
                </div>
                <div
                  class="bg-linear-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text leading-none font-semibold tracking-tight text-transparent"
                >
                  ANGULAR
                </div>
              </div>
            </div>
          </div>
        </ng-container>

        &lt;!&ndash; Navigation footer hook &ndash;&gt;
        <ng-container fuseVerticalNavigationFooter>
          <div class="mt-auto flex items-center border-t pt-4 pr-4 pb-4 pl-7">
            <div class="shrink-0">
              <img
                class="size-8 rounded-md"
                src="/images/avatars/brian-hughes.jpg"
                alt="User avatar"
              />
            </div>

            <div class="ml-4 flex w-full flex-col items-center overflow-hidden">
              <div
                class="leading-normal w-full overflow-hidden font-medium text-ellipsis whitespace-nowrap"
              >
                Brian Hughes
              </div>
              <div
                class="text-muted leading-normal w-full overflow-hidden text-center font-medium text-ellipsis whitespace-nowrap"
              >
                brian&#64;example.com
              </div>
            </div>

            <button
              mat-icon-button
              [matMenuTriggerFor]="userMenu"
            >
              <mat-icon svgIcon="chevrons-up-down"></mat-icon>
            </button>

            <mat-menu #userMenu="matMenu">
              <button mat-menu-item>
                <span class="flex flex-col py-2 leading-none">
                  <span>Signed in as</span>
                  <span class="mt-1.5 font-semibold"
                    >brian&#64;example.com</span
                  >
                </span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item>
                <mat-icon svgIcon="circle-user"></mat-icon>
                <span>Profile</span>
              </button>
              <button mat-menu-item>
                <mat-icon svgIcon="settings"></mat-icon>
                <span>Settings</span>
              </button>
              <mat-divider></mat-divider>
              <button
                mat-menu-item
                routerLink="/auth/sign-in"
              >
                <mat-icon svgIcon="log-out"></mat-icon>
                <span>Sign out</span>
              </button>
            </mat-menu>
          </div>
        </ng-container>
      </fuse-vertical-navigation>-->

      <!-- Wrapper -->
      <!--<div class="flex w-full min-w-0 flex-auto flex-col">
        &lt;!&ndash; Header &ndash;&gt;
        <div
          class="bg-card relative z-49 flex h-16 w-full flex-0 items-center px-4 shadow md:px-6 dark:border-b dark:bg-transparent dark:shadow-none print:hidden"
        >
          &lt;!&ndash; Navigation toggle button &ndash;&gt;
          <button
            mat-icon-button
            (click)="toggleNavigation('mainNavigation')"
          >
            <mat-icon svgIcon="menu"></mat-icon>
          </button>
          &lt;!&ndash; Components &ndash;&gt;
          <div class="ml-auto flex items-center space-x-0.5 pl-2 sm:space-x-2">
            &lt;!&ndash;<languages />&ndash;&gt;
            &lt;!&ndash;<fullscreen />&ndash;&gt;
            &lt;!&ndash;<search [appearance]="'bar'"></search>&ndash;&gt;
            &lt;!&ndash;<shortcuts />&ndash;&gt;
            &lt;!&ndash;<messages />&ndash;&gt;
            &lt;!&ndash;<button
            class="lg:hidden"
            mat-icon-button
            (click)="quickChat.toggle()"
          >
            <mat-icon svgIcon="message-circle" />
          </button>&ndash;&gt;
            &lt;!&ndash;<notifications />&ndash;&gt;
            <scheme-switcher />
            <theme-switcher />
          </div>
        </div>

        &lt;!&ndash; Content &ndash;&gt;
        <div class="flex flex-auto flex-col">
          <router-outlet />
        </div>
      </div>-->
    </div>

    <!-- Quick chat -->
    <!--<quick-chat #quickChat="quickChat"></quick-chat>-->
  `,
})
export class AdminLayout {
  // Data
  // protected navigation = navigation;

  // Dependencies
  protected layoutService = inject(LayoutService);
  private media = inject(Media);
  private fuseNavigationService = inject(FuseNavigationService);

  // State
  protected isScreenSmall = this.media.match('(max-width: 768px)');

  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );

  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation =
      this.fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        name
      );

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
