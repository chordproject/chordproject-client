import { inject, Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class IconsService {
  private domSanitizer = inject(DomSanitizer);
  private matIconRegistry = inject(MatIconRegistry);

  constructor() {
    // Deprecated
    this.matIconRegistry.addSvgIconSet(
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'icons/material-twotone.svg'
      )
    );

    // Deprecated
    this.matIconRegistry.addSvgIconSetInNamespace(
      'mat_outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'icons/material-outline.svg'
      )
    );

    // Deprecated
    this.matIconRegistry.addSvgIconSetInNamespace(
      'mat_solid',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'icons/material-solid.svg'
      )
    );

    // Deprecated
    this.matIconRegistry.addSvgIconSetInNamespace(
      'feather',
      this.domSanitizer.bypassSecurityTrustResourceUrl('icons/feather.svg')
    );

    // Deprecated
    this.matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'icons/heroicons-outline.svg'
      )
    );

    // Deprecated
    this.matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_solid',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'icons/heroicons-solid.svg'
      )
    );

    // Deprecated
    this.matIconRegistry.addSvgIconSetInNamespace(
      'heroicons_mini',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'icons/heroicons-mini.svg'
      )
    );

    this.matIconRegistry.addSvgIconSetInNamespace(
      'lucide',
      this.domSanitizer.bypassSecurityTrustResourceUrl('icons/lucide.svg'),
      {
        viewBox: '0 0 24 24',
      }
    );
  }
}
