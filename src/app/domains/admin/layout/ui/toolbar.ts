import { Component } from '@angular/core';
import { SidebarToggle } from '@/app/domains/admin/layout/ui/sidebar-toggle';

@Component({
  selector: 'toolbar',
  imports: [SidebarToggle],
  template: `
    <div class="flex min-h-16 items-center gap-x-1 border-b p-4">
      <sidebar-toggle class="" />
    </div>
  `,
})
export class Toolbar {}
