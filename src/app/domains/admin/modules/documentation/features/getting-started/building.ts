import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'docs-building',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="flex items-center gap-x-4 px-6 py-4 lg:px-10 lg:py-8">
        <div class="text-xl font-medium tracking-tighter sm:text-2xl">
          Building
        </div>
      </div>

      <!-- Content -->
      <div class="prose max-w-3xl flex-auto px-6 pb-4 lg:px-10 lg:pb-8">
        <p>
          To build and serve the application locally, run the following command:
        </p>
        <pre><code>ng build</code></pre>
        <p>
          This command compiles the application and prepares it for deployment.
        </p>
      </div>
    </div>
  `,
})
export default class DocsBuilding {}
