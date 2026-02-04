import { Component, computed, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Item } from '@/app/domains/admin/modules/apps/file-manager/data/model';

@Component({
  selector: 'file-manager-file-list',
  imports: [
    RouterLink,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatDivider,
    MatMenuTrigger,
  ],
  template: `
    <div class="flex flex-col">
      <!-- Header -->
      <div class="grid grid-cols-5 gap-x-2 px-3 py-2 md:grid-cols-10">
        <div class="col-span-3 font-medium md:col-span-7">Name</div>
        <div class="hidden font-medium md:block">Owner</div>
        <div class="text-right font-medium">File size</div>
        <div class="text-right font-medium">Actions</div>
      </div>

      <mat-divider />

      <!-- Folders -->
      @for (folder of folders(); track folder.id) {
        <div
          class="relative isolate grid grid-cols-5 items-center gap-x-2 border-b px-3 py-1 hover:bg-neutral-100 md:grid-cols-10"
        >
          <!-- Link -->
          <a
            class="absolute inset-0 z-0"
            [routerLink]="['/admin/file-manager/folders', folder.id]"
            ><span></span
          ></a>

          <!-- Name -->
          <div class="col-span-3 flex items-center gap-x-2 md:col-span-7">
            <mat-icon svgIcon="folder" />
            <div class="truncate">{{ folder.name }}</div>
          </div>

          <!-- Owner -->
          <div class="hidden whitespace-nowrap md:block">
            {{ folder.createdBy }}
          </div>

          <!-- File size -->
          <div class="text-right whitespace-nowrap">{{ folder.size }}</div>

          <!-- Actions -->
          <div class="relative z-10 text-right">
            <button
              matIconButton
              [matMenuTriggerFor]="folderMenu"
            >
              <mat-icon svgIcon="ellipsis" />
            </button>
            <mat-menu #folderMenu>
              <button mat-menu-item>
                <mat-icon svgIcon="download" />
                Download
              </button>
              <button mat-menu-item>
                <mat-icon svgIcon="pencil" />
                Rename
              </button>
              <mat-divider />
              <button mat-menu-item>
                <mat-icon svgIcon="user-plus" />
                Share
              </button>
              <button mat-menu-item>
                <mat-icon svgIcon="info" />
                Folder information
              </button>
              <mat-divider />
              <button mat-menu-item>
                <mat-icon svgIcon="trash" />
                Delete
              </button>
            </mat-menu>
          </div>
        </div>
      }

      @for (file of files(); track file.id) {
        <div
          class="relative isolate grid grid-cols-5 items-center gap-x-2 border-b px-3 py-1 hover:bg-neutral-100 md:grid-cols-10"
        >
          <!-- Name -->
          <div class="col-span-3 flex items-center gap-x-2 md:col-span-7">
            <mat-icon svgIcon="file" />
            <div class="truncate">{{ file.name }}</div>
          </div>

          <!-- Owner -->
          <div class="hidden whitespace-nowrap md:block">
            {{ file.createdBy }}
          </div>

          <!-- File size -->
          <div class="text-right whitespace-nowrap">{{ file.size }}</div>

          <!-- Actions -->
          <div class="relative z-10 text-right">
            <button
              matIconButton
              [matMenuTriggerFor]="fileMenu"
            >
              <mat-icon svgIcon="ellipsis" />
            </button>
            <mat-menu #fileMenu>
              <button mat-menu-item>
                <mat-icon svgIcon="download" />
                Download
              </button>
              <button mat-menu-item>
                <mat-icon svgIcon="pencil" />
                Rename
              </button>
              <mat-divider />
              <button mat-menu-item>
                <mat-icon svgIcon="user-plus" />
                Share
              </button>
              <button mat-menu-item>
                <mat-icon svgIcon="info" />
                File information
              </button>
              <mat-divider />
              <button mat-menu-item>
                <mat-icon svgIcon="trash" />
                Delete
              </button>
            </mat-menu>
          </div>
        </div>
      }
    </div>
  `,
})
export class FileManagerFileList {
  // Input / Output
  readonly items = input.required<Item[]>();

  // State
  protected folders = computed(() => {
    const items = this.items();
    return items.filter((item) => item.type === 'folder');
  });

  protected files = computed(() => {
    const items = this.items();
    return items.filter((item) => item.type !== 'folder');
  });
}
