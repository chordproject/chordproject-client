import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AuthService } from '@/app/core/firebase/auth/auth.service';
import { Scheme, Theming } from '@/app/core/theming';
import { UserService } from '@/app/core/user/user.service';

@Component({
  selector: 'user',
  imports: [
    MatDivider,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatPseudoCheckbox,
    MatMenuTrigger,
    TranslocoModule,
    RouterLink,
  ],
  template: `
    <button
      class="flex w-full cursor-pointer items-center gap-x-3 rounded-xl p-2 text-left hover:bg-neutral-700/10 dark:hover:bg-neutral-300/10"
      [matMenuTriggerFor]="userMenu"
    >
      @if (avatarUrl(); as avatarUrl) {
        <img
          class="size-9 rounded-lg object-cover"
          [src]="avatarUrl"
          alt="User avatar"
          referrerpolicy="no-referrer"
          (error)="markAvatarAsFailed(avatarUrl)"
        />
      } @else {
        <div
          class="flex size-9 items-center justify-center rounded-lg bg-neutral-900/5 dark:bg-neutral-50/10"
        >
          <mat-icon svgIcon="user-round" />
        </div>
      }
      <div class="flex min-w-0 flex-auto flex-col select-none">
        <div class="truncate font-medium">
          @if (displayNameTranslationKey(); as key) {
            {{ key | transloco }}
          } @else {
            {{ displayName() }}
          }
        </div>
        <div class="text-on-surface-variant truncate text-sm">
          {{ user()?.email || ('user_menu.not_signed_in' | transloco) }}
        </div>
      </div>
      <mat-icon
        class="size-4"
        svgIcon="ellipsis-vertical"
      />
    </button>

    <mat-menu
      class="min-w-60"
      xPosition="before"
      yPosition="above"
      #userMenu="matMenu"
    >
      <button
        class="py-2 [&>span]:flex [&>span]:items-center"
        mat-menu-item
      >
        @if (avatarUrl(); as avatarUrl) {
          <img
            class="size-9 rounded-lg object-cover"
            [src]="avatarUrl"
            alt="User avatar"
            referrerpolicy="no-referrer"
            (error)="markAvatarAsFailed(avatarUrl)"
          />
        } @else {
          <div
            class="flex size-9 items-center justify-center rounded-lg bg-neutral-900/5 dark:bg-neutral-50/10"
          >
            <mat-icon svgIcon="user-round" />
          </div>
        }
        <div class="ml-3 flex min-w-0 flex-auto flex-col select-none">
          <div class="truncate font-medium">
            @if (displayNameTranslationKey(); as key) {
              {{ key | transloco }}
            } @else {
              {{ displayName() }}
            }
          </div>
          <div class="text-on-surface-variant truncate text-xs">
            {{ user()?.email || ('user_menu.not_signed_in' | transloco) }}
          </div>
        </div>
      </button>
      <mat-divider />
      @if (user()) {
        <button mat-menu-item>
          <mat-icon svgIcon="user-round" />
          {{ 'user_menu.account' | transloco }}
        </button>
        <button
          mat-menu-item
          (click)="changePassword()"
        >
          <mat-icon svgIcon="rectangle-ellipsis" />
          {{ 'user_menu.change_password' | transloco }}
        </button>
        <mat-divider />
      }
      <button
        mat-menu-item
        [matMenuTriggerFor]="appearanceMenu"
      >
        <mat-icon svgIcon="sun-moon" />
        {{ 'user_menu.appearance' | transloco }}
      </button>
      <mat-divider />
      @if (user()) {
        <button
          mat-menu-item
          (click)="signOut()"
        >
          <mat-icon svgIcon="log-out" />
          {{ 'user_menu.sign_out' | transloco }}
        </button>
      } @else {
        <button
          mat-menu-item
          routerLink="/auth/sign-in"
        >
          <mat-icon svgIcon="log-in" />
          {{ 'nav.sign_in' | transloco }}
        </button>
      }
    </mat-menu>

    <mat-menu #appearanceMenu="matMenu">
      @for (item of schemes; track item.value) {
        <button
          mat-menu-item
          (click)="updateScheme(item.value)"
        >
          <mat-pseudo-checkbox
            appearance="minimal"
            class="mr-2"
            [state]="scheme() === item.value ? 'checked' : 'unchecked'"
          />
          <span>{{ item.label | transloco }}</span>
        </button>
      }
    </mat-menu>
  `,
})
export class User {
  // Dependencies
  private theming = inject(Theming);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // State
  private failedAvatarUrl = signal<string | null>(null);
  protected scheme = computed(() => this.theming.scheme());
  protected user = toSignal(this.userService.user$);
  protected avatarUrl = computed(() => {
    const avatar = this.user()?.avatar;
    return avatar && avatar !== this.failedAvatarUrl() ? avatar : '';
  });
  protected displayNameTranslationKey = computed(() => {
    const user = this.user();
    if (!user) {
      return 'user_menu.guest';
    }

    if (!user.name && !user.email) {
      return 'user_menu.default_name';
    }

    return null;
  });
  protected displayName = computed(() => {
    const user = this.user();
    if (!user) {
      return '';
    }

    return user.name || user.email?.split('@')[0] || '';
  });
  protected schemes: { label: string; value: Scheme }[] = [
    { label: 'scheme.light', value: 'light' },
    { label: 'scheme.dark', value: 'dark' },
    { label: 'scheme.system', value: 'system' },
  ];

  updateScheme(scheme: Scheme) {
    this.theming.scheme.set(scheme);
  }

  markAvatarAsFailed(avatarUrl: string) {
    this.failedAvatarUrl.set(avatarUrl);
  }

  signOut() {
    this.authService.signOut().subscribe(() => {
      this.router.navigateByUrl('/home');
    });
  }

  changePassword() {
    this.router.navigateByUrl('/auth/forgot-password');
  }
}
