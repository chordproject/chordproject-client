import { Component, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { LayoutService } from '@/app/domains/admin/layout/data/layout';

@Component({
  selector: 'sidebar-toggle',
  imports: [MatIconButton, MatIcon],
  template: `
    <button
      matIconButton
      class="small"
      (click)="toggleSidebarOpen()"
    >
      <mat-icon svgIcon="panel-left" />
    </button>
  `,
})
export class SidebarToggle {
  // Dependencies
  protected layoutService = inject(LayoutService);

  toggleSidebarOpen() {
    this.layoutService.sidebarOpen.update((value) => !value);
  }
}
