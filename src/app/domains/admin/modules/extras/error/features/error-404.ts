import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'error-404',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  template: `
    <div class="relative flex min-h-full flex-auto items-center justify-center overflow-hidden bg-neutral-50 p-6 dark:bg-neutral-950 sm:p-10">
      <div class="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-primary-100/70 blur-3xl dark:bg-primary-950/40"></div>
      <div class="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl dark:bg-amber-950/20"></div>

      <main class="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl shadow-neutral-300/30 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/30 lg:grid-cols-[0.85fr_1.15fr]">
        <section class="relative flex min-h-64 flex-col justify-between overflow-hidden bg-neutral-950 p-8 text-white sm:p-12 lg:min-h-[500px]">
          <div class="absolute inset-0 opacity-20 [background-image:linear-gradient(135deg,transparent_0%,transparent_48%,rgba(255,255,255,0.25)_49%,transparent_50%),linear-gradient(45deg,transparent_0%,transparent_48%,rgba(255,255,255,0.16)_49%,transparent_50%)] [background-size:42px_42px]"></div>
          <div class="relative">
            <img
              [src]="'/' + brand + '/logo/logo-text-light.svg'"
              [alt]="brand === 'hj' ? 'HomenaJesus' : 'ChordProject'"
              class="h-auto max-w-56"
            />
          </div>

          <div class="relative mt-12 lg:mt-0">
            <div class="mb-5 flex items-end gap-1 text-primary-300" aria-hidden="true">
              <span class="h-8 w-1 rounded-full bg-current"></span>
              <span class="h-14 w-1 rounded-full bg-current"></span>
              <span class="h-10 w-1 rounded-full bg-current"></span>
              <span class="h-20 w-1 rounded-full bg-current"></span>
              <span class="h-12 w-1 rounded-full bg-current"></span>
            </div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">Una pausa en el compás</p>
            <p class="mt-3 max-w-xs text-2xl font-semibold leading-tight">La página que buscas cambió de canción.</p>
          </div>
        </section>

        <section class="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <p class="text-sm font-bold uppercase tracking-[0.22em] text-primary-600 dark:text-primary-400">Error 404</p>
          <h1 class="mt-4 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-6xl">No encontramos esa página</h1>
          <p class="mt-5 max-w-lg text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg">
            Puede que el enlace esté desactualizado o que la página ya no exista. Vuelve al repertorio y sigue con tu música.
          </p>

          <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <a matButton="filled" routerLink="/home" class="inline-flex items-center justify-center gap-2">
              <mat-icon svgIcon="arrow-left" aria-hidden="true"></mat-icon>
              Ir al inicio
            </a>
            <a matButton="outlined" routerLink="/library" class="inline-flex items-center justify-center gap-2">
              <mat-icon svgIcon="book-open" aria-hidden="true"></mat-icon>
              Abrir biblioteca
            </a>
          </div>

          <div class="mt-12 flex items-center gap-3 border-t border-neutral-200 pt-5 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            <mat-icon svgIcon="music" class="text-primary-600 dark:text-primary-400" aria-hidden="true"></mat-icon>
            <span>Encuentra una canción y vuelve a tocar.</span>
          </div>
        </section>
      </main>
    </div>
  `,
})
export default class Error404 {
  protected readonly brand = environment.brand;
}
