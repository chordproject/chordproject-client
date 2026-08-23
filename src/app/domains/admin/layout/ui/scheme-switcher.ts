import { Component, computed, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { Theming } from '@/app/core/theming';

@Component({
  selector: 'scheme-switcher',
  imports: [MatIcon, MatIconButton, TranslocoModule],
  template: `
    <button
      matIconButton
      [attr.aria-label]="
        (isDark() ? 'scheme.switch_to_light' : 'scheme.switch_to_dark')
          | transloco
      "
      (click)="toggleScheme()"
    >
      <mat-icon [svgIcon]="isDark() ? 'sun' : 'moon'" />
    </button>
  `,
})
export class SchemeSwitcher {
  // Dependencies
  private theming = inject(Theming);

  // State
  protected isDark = computed(() => this.theming.isDark());

  toggleScheme() {
    this.theming.scheme.set(this.isDark() ? 'light' : 'dark');
  }
}
