import { Component, computed, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FileManagerService } from '@/app/domains/admin/modules/apps/file-manager/data/file-manager';
import { Item } from '@/app/domains/admin/modules/apps/file-manager/data/model';
import { FileManagerFileList } from '@/app/domains/admin/modules/apps/file-manager/ui/list';

@Component({
  selector: 'file-manager',
  imports: [MatButton, MatIcon, FileManagerFileList, RouterLink],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col gap-4 p-6 sm:gap-6 lg:p-10 lg:pt-8"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-x-3">
        <div class="flex flex-col">
          <!-- Breadcrumb -->
          @let trail = this.trail();
          @if (trail.length) {
            <div class="flex flex-wrap items-center gap-2">
              <a
                class="flex items-center gap-x-2 text-primary-600"
                routerLink="/admin/file-manager"
              >
                <span class="font-medium">My files</span>
              </a>
              <div class="">/</div>
              @for (
                breadcrumb of trail;
                track breadcrumb.id;
                let last = $last
              ) {
                @if (!last) {
                  <a
                    class="font-medium text-primary-600"
                    [routerLink]="[
                      '/admin/file-manager/folders',
                      breadcrumb.id,
                    ]"
                  >
                    {{ breadcrumb.name }}
                  </a>
                  <div class="">/</div>
                } @else {
                  <div class="font-medium">
                    {{ breadcrumb.name }}
                  </div>
                }
              }
            </div>
          } @else {
            <div class="font-medium">My files</div>
          }

          <div class="mt-4 text-xl font-semibold tracking-tighter sm:text-2xl">
            File Manager
          </div>
          <div class="mt-0.5 text-neutral-500">
            Manage your files and documents efficiently.
          </div>
        </div>

        <!-- Spacer -->
        <div class="flex-auto"></div>

        <button matButton="outlined">
          <mat-icon svgIcon="upload" />
          Upload
        </button>
      </div>

      <!-- Content -->
      <div class="">
        <file-manager-file-list [items]="items()" />
      </div>
    </div>
  `,
})
export default class FileManager {
  // Dependencies
  private fileManagerService = inject(FileManagerService);

  // Input / Output
  readonly folderId = input<string>();

  // State
  protected data = this.fileManagerService.data;
  protected items = computed(() => {
    const folderId = this.folderId();
    if (folderId) {
      return this.data.filter((item) => item.folderId === folderId)!;
    }

    return this.data.filter((item) => item.folderId === null)!;
  });

  // Build the breadcrumb trail by walking the folder hierarchy.
  // This implementation is intentionally simple and meant for demonstration
  // only.
  //
  // In real-world applications, breadcrumbs are typically derived directly from
  // object keys that encode the full path (e.g. /home/user/documents/my-document.txt),
  // or from a separate metadata store that models the folder structure explicitly.
  protected trail = computed(() => {
    const folderId = this.folderId();
    const data = this.data;
    const trail: Item[] = [];

    // Prepare the current folder
    let currentFolder: Item | null = null;

    // Get the current folder and add it as the first entry
    if (folderId) {
      currentFolder = data.find((item) => item.id === folderId)!;
      trail.push(currentFolder);
    }

    // Start traversing and storing the folders as a path array
    // until we hit null on the folder id
    while (currentFolder?.folderId) {
      currentFolder = data.find((item) => item.id === currentFolder?.folderId)!;
      if (currentFolder) {
        trail.unshift(currentFolder);
      }
    }

    return trail;
  });
}
