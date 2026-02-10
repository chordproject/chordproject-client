import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'docs-installation',
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
        <h4>1. Unzip</h4>
        <p>
          Unzip the file you have downloaded from Themeforest and then unzip the
          fuse-vX.X.X.zip file inside it.
        </p>

        <h4>2. Run the installation command</h4>
        <p>
          After you unzip the file, open a terminal and navigate to the folder
          where you unzipped the file. Make sure you are in the same folder with
          the <strong>package.json</strong> file before you run the installation
          command.
        </p>
        <p>To complete the installation, enter the following command:</p>
        <pre><code>npm install</code></pre>
        <p>
          This command will take some time and install all the required
          libraries into the
          <strong>node_modules</strong> directory in order for you to start
          developing.
        </p>
      </div>
    </div>
  `,
})
export default class DocsInstallation {}
