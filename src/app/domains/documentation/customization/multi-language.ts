import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'multi-language',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div class="flex min-w-0 flex-auto flex-col">
      <!-- Header -->
      <div
        class="bg-card flex flex-0 flex-col border-b p-6 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-8 dark:bg-transparent"
      >
        <div class="min-w-0 flex-1">
          <!-- Breadcrumbs -->
          <div class="flex flex-wrap items-center font-medium">
            <div>
              <a class="whitespace-nowrap text-primary-500">Documentation</a>
            </div>
            <div class="ml-1 flex items-center whitespace-nowrap">
              <mat-icon
                class="text-muted size-5"
                [svgIcon]="'heroicons_mini:chevron-right'"
              ></mat-icon>
              <a class="ml-1 text-primary-500">Guides</a>
            </div>
            <div class="ml-1 flex items-center whitespace-nowrap">
              <mat-icon
                class="text-muted size-5"
                [svgIcon]="'heroicons_mini:chevron-right'"
              ></mat-icon>
              <span class="text-muted ml-1">Customization</span>
            </div>
          </div>
          <!-- Title -->
          <div class="mt-2">
            <h2
              class="truncate text-3xl leading-7 font-extrabold tracking-tight sm:leading-10 md:text-4xl"
            >
              Multi Language
            </h2>
          </div>
        </div>
      </div>

      <div class="prose-sm prose max-w-3xl flex-auto p-6 sm:p-10">
        <p>
          Fuse uses <strong>Transloco</strong> library for the multi language
          support.
        </p>

        <h2>Official documentation</h2>
        <p>
          You can access the official documentation of
          <strong>Transloco</strong> over here:
          https://ngneat.github.io/transloco/docs/installation
        </p>
        <p>
          Other than the initial setup, Fuse doesn't introduce anything to
          <strong>Transloco</strong> or change any of its functionality. You can
          follow the official documentation to get started.
        </p>

        <h2>Translating the navigation</h2>
        <p>
          Since <code>FuseNavigation</code> supports runtime data swapping, you
          can replace the navigation data either partially or completely when
          the language changes. The <strong>LanguageComponent</strong> is a
          suitable place to do this and it's located at
          <code>src/app/layout/common/languages</code>.
        </p>

        <h2>Removing Transloco</h2>
        <p>
          If you don't need multi language support in your project, you may
          remove the <strong>Transloco</strong> support. Here's a step by step
          guide to remove the <strong>Transloco</strong> from Fuse:
        </p>
        <ol>
          <li>
            Navigate to <code>src/app.config.ts</code> file and remove the lines
            marked with the comment
            <code>// Transloco Config</code>
          </li>
          <li>Remove the <code>src/app/core/transloco</code> directory</li>
          <li>
            Do a project wide search for
            <code>&lt;languages&gt;&lt;/languages&gt;</code> and remove all
            instances
          </li>
          <li>
            Remove the
            <code>src/app/layout/common/languages</code> directory
          </li>
          <li>
            Finally navigate to the <code>package.json</code> file, remove the
            <strong>"&#64;ngneat/transloco"</strong> from dependencies list and
            run <code>npm install</code> command
          </li>
        </ol>
      </div>
    </div>
  `,
})
export default class MultiLanguageCustomization {}
