import { inject, Injectable, linkedSignal } from '@angular/core';
import { Media } from '@/app/core/media';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  // Dependencies
  private media = inject(Media);

  // State
  sidebarOpen = linkedSignal(() => !this.media.match(`(max-width: 1023px)`)());
}
