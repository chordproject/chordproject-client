import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { ThemeService } from '@/app/core/theme/theme.service';

@Component({
  selector: 'scheme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, MatIconButton],
  template: `
    @let lightIcon = 'lucide:sun';
    @let darkIcon = 'lucide:moon';
    @let systemIcon = 'lucide:monitor';

    <button mat-icon-button [matMenuTriggerFor]="schemeSwitcherMenu">
      @if (scheme() === 'light') {
        <mat-icon [svgIcon]="lightIcon"></mat-icon>
      } @else if (scheme() === 'dark') {
        <mat-icon [svgIcon]="darkIcon"></mat-icon>
      } @else {
        <mat-icon [svgIcon]="systemIcon"></mat-icon>
      }
    </button>
    <mat-menu #schemeSwitcherMenu>
      <button
        mat-menu-item
        [class.selected]="scheme() === 'light'"
        (click)="scheme.set('light')"
      >
        <mat-icon [svgIcon]="lightIcon"></mat-icon>
        Light
      </button>
      <button
        mat-menu-item
        [class.selected]="scheme() === 'dark'"
        (click)="scheme.set('dark')"
      >
        <mat-icon [svgIcon]="darkIcon"></mat-icon>
        Dark
      </button>
      <button
        mat-menu-item
        [class.selected]="scheme() === 'system'"
        (click)="scheme.set('system')"
      >
        <mat-icon [svgIcon]="systemIcon"></mat-icon>
        System
      </button>
    </mat-menu>
  `,
})
export default class FuseSchemeSwitcher {
  // Injections
  private themeService = inject(ThemeService);

  // Fields
  protected scheme = this.themeService.scheme;
}
