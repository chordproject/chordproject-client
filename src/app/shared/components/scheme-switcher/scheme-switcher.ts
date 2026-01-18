import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Scheme, Theming } from '@/app/core/theming';

@Component({
  selector: 'scheme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIconButton,
    MatPseudoCheckbox,
  ],
  template: `
    <button
      mat-icon-button
      [matMenuTriggerFor]="schemeSwitcherMenu"
    >
      <mat-icon svgIcon="sun-moon" />
    </button>

    <mat-menu #schemeSwitcherMenu>
      @for (option of schemeOptions; track option.value) {
        <button
          mat-menu-item
          [class.selected]="scheme() === option.value"
          (click)="theming.scheme.set(option.value)"
        >
          {{ option.label }}
          @if (option.value === scheme()) {
            <mat-pseudo-checkbox
              appearance="minimal"
              state="checked"
            />
          }
        </button>
      }
    </mat-menu>
  `,
})
export default class FuseSchemeSwitcher {
  // Dependencies
  protected theming = inject(Theming);

  // State
  protected scheme = computed(() => this.theming.scheme());
  protected schemeOptions: { value: Scheme; label: string }[] = [
    {
      value: 'light',
      label: 'Light',
    },
    {
      value: 'dark',
      label: 'Dark',
    },
    {
      value: 'system',
      label: 'System',
    },
  ];
}
