import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { FuseConfirmationConfig } from '../confirmation.types';

const ICON_CLASSES: Record<'primary' | 'error' | 'neutral', string> = {
  primary:
    'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400',
  error:
    'bg-error-100 text-error-600 dark:bg-error-500/20 dark:text-error-400',
  neutral: 'bg-neutral-900/5 text-neutral-600 dark:bg-neutral-50/10 dark:text-neutral-300',
};

@Component({
  selector: 'fuse-confirmation-dialog',
  imports: [MatButton, MatIconButton, MatDialogModule, MatIcon, TranslocoModule],
  template: `
    <div class="relative flex w-full flex-col sm:min-w-100">
      @if (data.dismissible) {
        <button
          matIconButton
          class="absolute right-2 top-2"
          [matDialogClose]="undefined"
        >
          <mat-icon svgIcon="x" />
        </button>
      }

      <div
        class="flex flex-col items-center gap-y-4 p-6 text-center sm:flex-row sm:items-start sm:gap-x-4 sm:text-left"
      >
        @if (data.icon?.show ?? true) {
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-full"
            [class]="iconClasses"
          >
            <mat-icon [svgIcon]="data.icon?.name ?? 'triangle-alert'" />
          </div>
        }
        <div class="flex flex-col gap-y-1">
          @if (data.title) {
            <div class="text-lg font-semibold">{{ data.title | transloco }}</div>
          }
          @if (data.message) {
            <div class="text-on-surface-variant text-sm">
              {{ data.message | transloco }}
            </div>
          }
        </div>
      </div>

      <div
        class="flex items-center justify-center gap-x-3 border-t px-6 py-4 sm:justify-end"
      >
        @if (data.actions?.cancel?.show ?? true) {
          <button
            matButton="outlined"
            [matDialogClose]="'cancelled'"
          >
            {{ (data.actions?.cancel?.label ?? 'confirmation.cancel') | transloco }}
          </button>
        }
        @if (data.actions?.confirm?.show ?? true) {
          <button
            matButton="filled"
            [style]="confirmButtonStyle"
            [matDialogClose]="'confirmed'"
          >
            {{ (data.actions?.confirm?.label ?? 'confirmation.confirm') | transloco }}
          </button>
        }
      </div>
    </div>
  `,
})
export class FuseConfirmationDialogComponent {
  data: FuseConfirmationConfig = inject(MAT_DIALOG_DATA);

  protected iconClasses = ICON_CLASSES[this.data.icon?.color ?? 'error'];

  protected confirmButtonStyle =
    (this.data.actions?.confirm?.color ?? 'error') === 'error'
      ? '--mdc-filled-button-container-color: var(--color-error-600); --mdc-filled-button-label-text-color: white;'
      : '';
}
