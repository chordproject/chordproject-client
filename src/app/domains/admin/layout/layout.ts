import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDrawer,
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { Media } from '@/app/core/media';
import { GithubLink } from '@/app/domains/admin/layout/ui/github-link';
import { LanguageSwitcher } from '@/app/domains/admin/layout/ui/language-switcher';
import { SchemeSwitcher } from '@/app/domains/admin/layout/ui/scheme-switcher';
import { AdminSidebar } from '@/app/domains/admin/layout/ui/sidebar';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { FeedbackService } from 'app/core/firebase/api/feedback.service';
import { FeedbackDialog, FeedbackDialogResult } from './ui/feedback-dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { environment } from 'environments/environment';

@Component({
  selector: 'admin-layout',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterOutlet,
    MatSidenavContainer,
    MatDrawer,
    MatSidenav,
    FeedbackDialog,
    MatSidenavContent,
    RouterLink,
    AdminSidebar,
    SchemeSwitcher,
    LanguageSwitcher,
    GithubLink,
    SearchComponent,
    TranslocoModule,
  ],
  template: `
    <mat-sidenav-container>
      <mat-drawer
        class="w-full sm:w-[28rem]"
        position="end"
        mode="over"
        [opened]="feedbackOpen()"
        (closed)="feedbackOpen.set(false)"
      >
        <admin-feedback-dialog
          (submitted)="submitFeedback($event)"
          (cancelled)="closeFeedback()"
        />
      </mat-drawer>

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
                class="h-8 w-auto dark:brightness-0 dark:invert"
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
            <button
              matIconButton
              type="button"
              [attr.aria-label]="'feedback.open' | transloco"
              [matTooltip]="'feedback.open' | transloco"
              (click)="openFeedback()"
            >
              <mat-icon svgIcon="message-circle" />
            </button>
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
  private feedbackService = inject(FeedbackService);
  private snackBar = inject(MatSnackBar);
  private transloco = inject(TranslocoService);
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

  protected feedbackOpen = signal(false);

  protected openFeedback(): void {
    this.feedbackOpen.set(true);
  }

  protected closeFeedback(): void {
    this.feedbackOpen.set(false);
  }

  protected submitFeedback(result: FeedbackDialogResult): void {
    this.feedbackService.create({ ...result, pageUrl: window.location.href }).subscribe((feedbackId) => {
      if (!feedbackId) {
        return;
      }

      this.closeFeedback();
      this.transloco.selectTranslate('feedback.sent').pipe(take(1)).subscribe((message) => {
        this.snackBar.open(message, undefined, { duration: 4000 });
      });
    });
  }
}
