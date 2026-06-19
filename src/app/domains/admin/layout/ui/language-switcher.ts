import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { LangDefinition, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'language-switcher',
  imports: [
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatPseudoCheckbox,
  ],
  template: `
    <span class="fi fi-gr"></span>
    <span class="fi fi-gr"></span>

    <button
      matIconButton
      [matMenuTriggerFor]="langMenu"
    >
      <img
        [src]="'/images/flags/' + getLangFlag(this.activeLang) + '.svg'"
        alt="{{ this.activeLang }}"
        width="20"
        height="15"
      />
    </button>
    <mat-menu #langMenu="matMenu">
      @for (lang of availableLangs; track lang.id) {
        <button
          mat-menu-item
          (click)="setActiveLang(lang.id)"
        >
          <span class="flex items-center gap-x-3">
            <span class="flex items-center gap-x-2">
              <img
                [src]="'/images/flags/' + getLangFlag(lang.id) + '.svg'"
                alt="{{ this.activeLang }}"
                width="20"
                height="15"
              />
              <span>{{ lang.label }}</span>
            </span>
            <mat-pseudo-checkbox
              appearance="minimal"
              [state]="lang.id === activeLang ? 'checked' : 'unchecked'"
            />
          </span>
        </button>
      }
    </mat-menu>
  `,
})
export class LanguageSwitcher {
  // Dependencies
  private readonly transloco = inject(TranslocoService);

  // State
  protected activeLang = this.transloco.getActiveLang();
  protected readonly availableLangs =
    this.transloco.getAvailableLangs() as LangDefinition[];

  constructor() {
    this.transloco.langChanges$.pipe(takeUntilDestroyed()).subscribe((lang) => {
      this.activeLang = lang;
    });
  }

  setActiveLang(lang: string) {
    this.transloco.setActiveLang(lang);
  }

  getLangFlag(lang: string) {
    switch (lang) {
      case 'en': {
        return 'US';
      }
      case 'es': {
        return 'ES';
      }
      default: {
        return 'US';
      }
    }
  }
}
