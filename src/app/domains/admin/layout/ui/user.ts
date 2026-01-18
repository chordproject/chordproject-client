import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    RouterLink,
  ],
  template: `
    <!-- Button -->
    <button
      mat-icon-button
      [matMenuTriggerFor]="userActions"
    >
      <span class="relative">
        <img
          class="h-7 w-7 rounded-full"
          src="/images/photos/brian-hughes.jpg"
          alt="User Avatar"
        />
      </span>
    </button>

    <mat-menu
      [xPosition]="'before'"
      #userActions="matMenu"
    >
      <button mat-menu-item>
        <span class="flex flex-col leading-none">
          <span>Signed in as</span>
          <span class="mt-1.5 font-semibold">hughes.brian&#64;example.com</span>
        </span>
      </button>
      <mat-divider class="my-2"></mat-divider>
      <button mat-menu-item>
        <mat-icon [svgIcon]="'user-circle'"></mat-icon>
        <span>Profile</span>
      </button>
      <button mat-menu-item>
        <mat-icon [svgIcon]="'cog-8-tooth'"></mat-icon>
        <span>Settings</span>
      </button>
      <button
        mat-menu-item
        [matMenuTriggerFor]="userStatus"
      >
        <mat-icon [svgIcon]="'ellipsis-horizontal-circle'"></mat-icon>
        <span>Status</span>
      </button>
      <mat-divider class="my-2"></mat-divider>
      <button
        mat-menu-item
        routerLink="/auth/sign-in"
      >
        <mat-icon [svgIcon]="'arrow-right-on-rectangle'"></mat-icon>
        <span>Sign out</span>
      </button>
    </mat-menu>

    <mat-menu
      class="user-status-menu"
      #userStatus="matMenu"
    >
      <button mat-menu-item>
        <span class="flex items-center">
          <span class="mr-3 size-3 rounded-full bg-green-500"></span>
          <span>Online</span>
        </span>
      </button>
      <button mat-menu-item>
        <span class="flex items-center">
          <span class="mr-3 size-3 rounded-full bg-amber-500"></span>
          <span>Away</span>
        </span>
      </button>
      <button mat-menu-item>
        <span class="flex items-center">
          <span class="mr-3 size-3 rounded-full bg-red-500"></span>
          <span>Busy</span>
        </span>
      </button>
      <button mat-menu-item>
        <span class="flex items-center">
          <span class="mr-3 size-3 rounded-full bg-gray-400"></span>
          <span>Invisible</span>
        </span>
      </button>
    </mat-menu>
  `,
})
export class User {}
