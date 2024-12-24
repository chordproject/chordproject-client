import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { FUSE_THEME_CONFIG } from '@/app/core/theme/theme.provider';
import { ThemeService } from '@/app/core/theme/theme.service';

@Component({
  selector: 'theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIconButton,
    TitleCasePipe,
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="themeSwitcherMenu">
      <mat-icon svgIcon="lucide:paintbrush"></mat-icon>
    </button>
    <mat-menu #themeSwitcherMenu>
      @for (item of themes; track item.name) {
        <button
          mat-menu-item
          [class.selected]="theme() === item.name"
          (click)="theme.set(item.name)"
        >
          <span
            class="inline-flex size-3 rounded-full"
            [style.backgroundColor]="item.primaryColor"
          ></span>
          {{ item.name | titlecase }}
        </button>
      }
    </mat-menu>
  `,
})
export default class FuseThemeSwitcher {
  // Injections
  protected themes = inject(FUSE_THEME_CONFIG);
  private themeService = inject(ThemeService);

  // Fields
  protected theme = this.themeService.theme;
}
