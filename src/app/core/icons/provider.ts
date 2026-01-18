import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export const provideIcons = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    provideAppInitializer(() => {
      const domSanitizer = inject(DomSanitizer);
      const matIconRegistry = inject(MatIconRegistry);

      // Lucide icons
      matIconRegistry.addSvgIconSet(
        domSanitizer.bypassSecurityTrustResourceUrl('/icons/lucide.svg'),
        { viewBox: '0 0 24 24' }
      );
    }),
  ]);
