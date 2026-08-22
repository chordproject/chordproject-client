import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
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
  ],
  template: `
    <button
      class="flex w-full cursor-pointer items-center gap-x-3 rounded-xl p-2 text-left hover:bg-neutral-700/10 dark:hover:bg-neutral-300/10"
      [matMenuTriggerFor]="userMenu"
    >
      @if (user()?.avatar) {
        <img
          class="size-9 rounded-lg object-cover"
          [src]="user()!.avatar"
          alt="User avatar"
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
          {{ displayName() }}
        </div>
        <div class="text-on-surface-variant truncate text-sm">
          {{ user()?.email || 'Not signed in' }}
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
        @if (user()?.avatar) {
          <img
            class="size-9 rounded-lg object-cover"
            [src]="user()!.avatar"
            alt="User avatar"
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
            {{ displayName() }}
          </div>
          <div class="text-on-surface-variant truncate text-xs">
            {{ user()?.email || 'Not signed in' }}
          </div>
        </div>
      </button>
      <mat-divider />
      <button mat-menu-item>
        <mat-icon svgIcon="user-round" />
        Account
      </button>
      <button
        mat-menu-item
        (click)="changePassword()"
      >
        <mat-icon svgIcon="rectangle-ellipsis" />
        Change password
      </button>
      <mat-divider />
      <button
        mat-menu-item
        [matMenuTriggerFor]="appearanceMenu"
      >
        <mat-icon svgIcon="sun-moon" />
        Appearance
      </button>
      <mat-divider />
      <button
        mat-menu-item
        (click)="signOut()"
      >
        <mat-icon svgIcon="log-out" />
        Sign out
      </button>
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
          <span>{{ item.label }}</span>
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
  protected scheme = computed(() => this.theming.scheme());
  protected user = toSignal(this.userService.user$);
  protected displayName = computed(() => {
    const user = this.user();
    if (!user) {
      return 'Guest';
    }
    return user.name || user.email?.split('@')[0] || 'User';
  });
  protected schemes: { label: string; value: Scheme }[] = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' },
  ];

  updateScheme(scheme: Scheme) {
    this.theming.scheme.set(scheme);
  }

  signOut() {
    this.authService.signOut().subscribe(() => {
      this.router.navigateByUrl('/auth/sign-in');
    });
  }

  changePassword() {
    this.router.navigateByUrl('/auth/forgot-password');
  }
}
