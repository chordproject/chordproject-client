import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';

@Component({
  selector: 'splash-screen',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, FuseHighlightComponent],
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
              <a class="ml-1 text-primary-500">Fuse Components</a>
            </div>
            <div class="ml-1 flex items-center whitespace-nowrap">
              <mat-icon
                class="text-muted size-5"
                [svgIcon]="'heroicons_mini:chevron-right'"
              ></mat-icon>
              <span class="text-muted ml-1">Services</span>
            </div>
          </div>
          <!-- Title -->
          <div class="mt-2">
            <h2
              class="truncate text-3xl leading-7 font-extrabold tracking-tight sm:leading-10 md:text-4xl"
            >
              Splash Screen
            </h2>
          </div>
        </div>
      </div>

      <div class="prose-sm prose max-w-3xl flex-auto p-6 sm:p-10">
        <p>
          <strong>FuseSplashScreenService</strong> is a singleton service to
          control the splash screen. By default, the splash screen goes away
          automatically as soon as Angular loads for the first time but, you can
          still show or hide it using the service afterwards.
        </p>

        <h2>Module</h2>
        <textarea
          fuse-highlight
          lang="typescript"
        >
                    import { FuseSplashScreenModule } from '@fuse/services/splash-screen';
                </textarea
        >

        <h2>Methods</h2>
        <div class="bg-card mt-4 rounded shadow">
          <div class="text-muted border-b px-6 py-3 font-mono">
            show(): void
          </div>
          <div class="p-6">Shows the splash screen.</div>
        </div>
        <div class="bg-card mt-4 rounded shadow">
          <div class="text-muted border-b px-6 py-3 font-mono">
            hide(): void
          </div>
          <div class="p-6">Hides the splash screen.</div>
        </div>
      </div>
    </div>
  `,
})
export default class SplashScreen {}
