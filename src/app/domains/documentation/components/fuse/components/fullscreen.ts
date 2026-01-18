import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';

@Component({
  selector: 'fullscreen',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FuseHighlightComponent],
  template: `
    <div class="flex min-w-0 flex-auto flex-col">
      <!-- Header -->
      <div
        class="bg-card flex flex-0 flex-col border-b p-6 dark:bg-transparent sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-8"
      >
        <div class="min-w-0 flex-1">
          <!-- Breadcrumbs -->
          <div class="flex flex-wrap items-center font-medium">
            <div>
              <a class="whitespace-nowrap text-primary-500">Documentation</a>
            </div>
            <div class="ml-1 flex items-center whitespace-nowrap">
              <mat-icon
                class="text-muted icon-size-5"
                [svgIcon]="'heroicons_mini:chevron-right'"
              ></mat-icon>
              <a class="ml-1 text-primary-500">Fuse Components</a>
            </div>
            <div class="ml-1 flex items-center whitespace-nowrap">
              <mat-icon
                class="text-muted icon-size-5"
                [svgIcon]="'heroicons_mini:chevron-right'"
              ></mat-icon>
              <span class="text-muted ml-1">Components</span>
            </div>
          </div>
          <!-- Title -->
          <div class="mt-2">
            <h2
              class="truncate text-3xl font-extrabold leading-7 tracking-tight sm:leading-10 md:text-4xl"
            >
              Fullscreen
            </h2>
          </div>
        </div>
      </div>

      <div class="prose prose-sm max-w-3xl flex-auto p-6 sm:p-10">
        <p>
          <strong>fuse-fullscreen</strong> is a small component that toggles the
          fullscreen on and off.
        </p>
        <p><strong>Exported as: </strong><code>fuseFullscreen</code></p>

        <h2>Module</h2>
        <textarea fuse-highlight lang="typescript">
                    import { FuseFullscreenModule } from '@fuse/components/fullscreen';
                </textarea
        >

        <h2>Usage</h2>
        <p>Here's the basic usage of the <code>fuse-fullscreen</code>:</p>
        <textarea fuse-highlight lang="html">
                    &lt;fuse-fullscreen&gt;&lt;/fuse-fullscreen&gt;
                </textarea
        >

        <h2>Properties</h2>
        <div class="bg-card rounded px-6 py-3 shadow">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-muted font-mono">
                  <div>&#64;Input()</div>
                  <div>iconTpl: TemplateRef&lt;any&gt;</div>
                </td>
                <td>Template reference for the icon.</td>
                <td>-</td>
              </tr>
              <tr>
                <td class="text-muted font-mono">
                  <div>&#64;Input()</div>
                  <div>tooltip: string</div>
                </td>
                <td>Tooltip of the toggle button.</td>
                <td>'Toggle Fullscreen'</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export default class Fullscreen {}
