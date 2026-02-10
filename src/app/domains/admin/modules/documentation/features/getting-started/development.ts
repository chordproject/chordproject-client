import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'docs-development',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    <div
      class="@container mx-auto flex w-full max-w-7xl flex-auto flex-col overflow-hidden"
    >
      <!-- Header -->
      <div class="flex items-center gap-x-4 px-6 py-4 lg:px-10 lg:py-8">
        <div class="text-xl font-medium tracking-tighter sm:text-2xl">
          Installation
        </div>
      </div>

      <!-- Content -->
      <div class="prose max-w-3xl flex-auto px-6 pb-4 lg:px-10 lg:pb-8">
        <p>
          After the installation process finishes, run the following command
          while still in your workspace directory:
        </p>
        <pre><code>ng serve</code></pre>
        <p>
          The <code>ng serve</code> command launches the server, watches your
          files, and rebuilds the app as you make changes to those files.
        </p>

        <h2>Alternate command</h2>
        <pre><code>npm start</code></pre>
        <p class="mb-12">
          Alias for <code>ng serve</code> with a predefined port to avoid
          conflicts with other Angular applications running on the same machine.
        </p>
      </div>
    </div>
  `,
})
export default class DocsDevelopment {}
