import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseHighlightComponent } from '@fuse/components/highlight';

@Component({
  selector: 'search',
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
              <a class="ml-1 text-primary-500">Other Components</a>
            </div>
            <div class="ml-1 flex items-center whitespace-nowrap">
              <mat-icon
                class="text-muted icon-size-5"
                [svgIcon]="'heroicons_mini:chevron-right'"
              ></mat-icon>
              <span class="text-muted ml-1">Common</span>
            </div>
          </div>
          <!-- Title -->
          <div class="mt-2">
            <h2
              class="truncate text-3xl font-extrabold leading-7 tracking-tight sm:leading-10 md:text-4xl"
            >
              Search
            </h2>
          </div>
        </div>
      </div>

      <div class="prose prose-sm max-w-3xl flex-auto p-6 sm:p-10">
        <p>
          This component can be used for searching. It will make API calls as
          you start typing the search query into the search field and show the
          results in the
          <em>Autocomplete</em> panel.
        </p>

        <h2>Usage</h2>
        <p>Here's the basic usage of the component:</p>
        <textarea fuse-highlight lang="html">
                    <search [appearance]="'bar'"></search>
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
                  <div>appearance: 'basic' | 'bar'</div>
                </td>
                <td>
                  Appearance of the search.
                  <strong>basic</strong> will show a simple search field.
                  <strong>bar</strong> will show a dropdown bar that covers the
                  header.
                </td>
                <td>
                  <code class="whitespace-nowrap">bar</code>
                </td>
              </tr>
              <tr>
                <td class="text-muted font-mono">
                  <div>&#64;Input()</div>
                  <div>debounce: number</div>
                </td>
                <td>Number of milliseconds to debounce the API calls.</td>
                <td>
                  <code class="whitespace-nowrap">300</code>
                </td>
              </tr>
              <tr>
                <td class="text-muted font-mono">
                  <div>&#64;Input()</div>
                  <div>minLength: number</div>
                </td>
                <td>
                  Minimum length of the search value required before making API
                  calls.
                </td>
                <td>
                  <code class="whitespace-nowrap">2</code>
                </td>
              </tr>
              <tr>
                <td class="text-muted font-mono">
                  <div>&#64;Output()</div>
                  <div>search: EventEmitter</div>
                </td>
                <td>An event emitted after search happened.</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export default class Search {}
