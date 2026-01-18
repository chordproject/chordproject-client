import { DOCUMENT } from '@angular/common';
import { afterNextRender, inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SplashScreenService {
  // Injections
  private document = inject(DOCUMENT);
  private router = inject(Router);

  private afterRenderRef = afterNextRender(() => {
    // Hide the splash screen on the first NavigationEnd event
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        this.hide();
      });
  });

  /**
   * Show the splash screen
   */
  show(): void {
    this.document.body.classList.remove('splash-screen-hidden');
  }

  /**
   * Hide the splash screen
   */
  hide(): void {
    this.document.body.classList.add('splash-screen-hidden');
  }
}
