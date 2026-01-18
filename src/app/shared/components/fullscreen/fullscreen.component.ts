import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'fullscreen',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatTooltipModule, MatIconModule],
  template: `
    <!-- Button -->
    <button
      mat-icon-button
      matTooltip="Toggle Fullscreen"
      (click)="toggleFullscreen()"
    >
      <mat-icon svgIcon="lucide:fullscreen"></mat-icon>
    </button>
  `,
})
export class FullscreenComponent {
  // Injections
  private document = inject(DOCUMENT);

  /**
   * Toggles the fullscreen mode.
   */
  toggleFullscreen(): void {
    if (!this.document.fullscreenEnabled) {
      console.log('Fullscreen is not available in this browser.');
      return;
    }

    // Check if the document is in fullscreen mode
    const fullScreen = this.document.fullscreenElement;

    // Toggle fullscreen mode
    if (fullScreen) {
      this.document.exitFullscreen();
    } else {
      this.document.documentElement.requestFullscreen().catch(() => {
        console.error('Entering fullscreen mode failed.');
      });
    }
  }
}
