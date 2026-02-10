import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'serving',
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
              <span class="text-muted ml-1">Getting Started</span>
            </div>
          </div>
          <!-- Title -->
          <div class="mt-2">
            <h2
              class="truncate text-3xl leading-7 font-extrabold tracking-tight sm:leading-10 md:text-4xl"
            >
              Serving
            </h2>
          </div>
        </div>
      </div>

      <div class="prose-sm prose max-w-3xl flex-auto p-6 sm:p-10">
        <p>
          After the installation process finishes, run the following command
          while still in your workspace directory:
        </p>
        <pre><code>ng serve</code></pre>
        <p>
          The <code>ng serve</code> command launches the server, watches your
          files, and rebuilds the app as you make changes to those files.
        </p>
        <p>
          The <code>--open</code> (or just <code>-o</code>) option automatically
          opens your browser to http://localhost:4200/.
        </p>

        <h2>Alternate command</h2>
        <pre><code>npm start</code></pre>
        <p class="mb-12">Alias for <code>ng serve --open</code>.</p>

        <!--<fuse-alert
          [appearance]="'border'"
          [type]="'info'"
        >
          If you are getting error messages that includes keywords like
          <strong>HEAP</strong>, <strong>JS stack tree</strong>,
          <strong>out of memory</strong> while trying to run
          <code>ng serve &#45;&#45;open</code> or <code>npm start</code> commands, you
          may have an older Node.js version, try updating your Node.js to the
          latest LTS version and then try again.
        </fuse-alert>-->
      </div>
    </div>
  `,
})
export default class Serving {}
