import { Component } from '@angular/core';
import { SidebarNavigation } from '@/app/domains/admin/layout/ui/sidebar-navigation';
import { SidebarUser } from '@/app/domains/admin/layout/ui/sidebar-user';

@Component({
  selector: 'admin-sidebar',
  imports: [SidebarNavigation, SidebarUser],
  host: {
    class: 'flex w-full flex-auto flex-col',
  },
  template: `
    <!-- Logo -->
    <div class="relative flex items-center gap-x-2.5 px-6 pt-5 pb-0">
      <img
        src="/images/logo/logo.svg"
        class="size-8"
        alt="Fuse logo"
      />

      <div class="flex flex-col">
        <div
          class="text-on-surface text-lg leading-none font-bold tracking-wider"
        >
          FUSE
        </div>
        <div class="font-mono text-2xs leading-3 font-medium tracking-tighter">
          Angular
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <sidebar-navigation class="my-4 flex-auto" />

    <!-- Footer -->
    <div class="p-2">
      <sidebar-user />
    </div>
  `,
})
export class AdminSidebar {}
