import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { RouterLink } from '@angular/router';
import { FuseAlertComponent } from '@fuse/components/alert';

interface DirNode {
  name: string;
  expandable?: boolean;
  level?: number;
  last?: boolean;
  children?: DirNode[];
}

interface FlatDirNode {
  name: string;
  expandable: boolean;
  level: number;
  last: boolean;
}

@Component({
  selector: 'directory-structure',
  styles: [
    `
      directory-structure .mat-tree {
        font-family: 'IBM Plex Mono', Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
      }

      directory-structure .mat-tree-node {
        min-height: 32px;
      }

      directory-structure .mat-tree .mat-icon-button {
        width: 32px;
        height: 32px;
        min-height: 32px;
        line-height: 32px;
        margin-right: 8px;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    FuseAlertComponent,
    MatTreeModule,
    RouterLink,
  ],
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
              <a class="ml-1 text-primary-500">Guides</a>
            </div>
            <div class="ml-1 flex items-center whitespace-nowrap">
              <mat-icon
                class="text-muted icon-size-5"
                [svgIcon]="'heroicons_mini:chevron-right'"
              ></mat-icon>
              <span class="text-muted ml-1">Development</span>
            </div>
          </div>
          <!-- Title -->
          <div class="mt-2">
            <h2
              class="truncate text-3xl font-extrabold leading-7 tracking-tight sm:leading-10 md:text-4xl"
            >
              Directory Structure
            </h2>
          </div>
        </div>
      </div>

      <div class="prose prose-sm max-w-3xl flex-auto p-6 sm:p-10">
        <fuse-alert [appearance]="'border'" [type]="'info'">
          Fuse's directory structure might look overwhelming and intimidating at
          first, but following this page and giving a bit time to understand it
          before jumping right into code will help immensely.
        </fuse-alert>
        <p>
          Fuse built around the idea of multi-purpose and multi-layout. You can
          think of Fuse as a
          <em>Starter kit</em> and a <em>guide</em> rather than just a simple
          template. The purpose of Fuse is not only provide a pre-made styles
          for visual elements but is also be a guide to follow while building an
          app.
        </p>
        <p>
          It's more of an answer to the questions like
          <strong>Where should I put this file?</strong> or
          <strong>Which file should I put this piece of code into?</strong>
          rather than just a compilation of example pages and ready to use
          styles.
        </p>
        <p>
          Here's a simplified version of the entire directory structure of the
          Fuse:
        </p>
        <div class="bg-card mt-6 rounded p-6 pl-3 shadow">
          <mat-tree
            [dataSource]="generalTree.dataSource"
            [treeControl]="generalTree.treeControl"
          >
            <!-- This is the tree node template for leaf nodes -->
            <mat-tree-node
              *matTreeNodeDef="let node"
              matTreeNodePaddingIndent="32"
              matTreeNodePadding
            >
              <div class="flex items-center font-mono">
                @if (!node.last) {
                  <div
                    class="text-muted mr-2 flex h-8 w-8 items-center justify-center"
                  >
                    ├─
                  </div>
                }
                @if (node.last) {
                  <div
                    class="text-muted mr-2 flex h-8 w-8 items-center justify-center"
                  >
                    └─
                  </div>
                }
                <span> {{ node.name }} </span>
              </div>
            </mat-tree-node>
            <!-- This is the tree node template for expandable nodes -->
            <mat-tree-node
              *matTreeNodeDef="let node; when: hasChild"
              matTreeNodePaddingIndent="32"
              matTreeNodePadding
            >
              <button
                mat-icon-button
                matTreeNodeToggle
                [attr.aria-label]="'toggle ' + node.name"
              >
                <mat-icon>
                  {{
                    generalTree.treeControl.isExpanded(node) ? 'remove' : 'add'
                  }}
                </mat-icon>
              </button>
              <span class="font-mono"> {{ node.name }} </span>
            </mat-tree-node>
          </mat-tree>
        </div>

        <h2>/public</h2>
        <p>
          Default folder for static assets like images, fonts, static styles and
          etc.
        </p>

        <h2>/src/&#64;fuse/</h2>
        <p>
          This is the core directory of the Fuse. It includes components,
          directives, services, pipes, custom validators, animations, base
          styles and much more.
        </p>
        <p>
          Modifications on this directory is
          <strong>NOT</strong> recommended. Since majority of changes happen
          within this directory on updates, any modifications to this directory
          and its content will make the updating process complex and time
          consuming.
        </p>

        <h2>src/app/</h2>
        <p>
          This directory contains all application related codes. This is where
          you put your code.
        </p>
        <p>
          Fuse provides a sensible default directory structure within the
          <strong>app</strong> directory. You can of course completely remove
          everything from it and design your own structure but the provided
          structure is designed to handle applications from <em>small</em> to
          <em>enterprise</em> grade:
        </p>
        <div class="bg-card mt-6 rounded p-6 pl-3 shadow">
          <mat-tree
            [dataSource]="appTree.dataSource"
            [treeControl]="appTree.treeControl"
          >
            <!-- This is the tree node template for leaf nodes -->
            <mat-tree-node
              *matTreeNodeDef="let node"
              matTreeNodePaddingIndent="32"
              matTreeNodePadding
            >
              <div class="flex items-center font-mono">
                @if (!node.last) {
                  <div class="mr-2 flex h-8 w-8 items-center justify-center">
                    ├─
                  </div>
                }
                @if (node.last) {
                  <div class="mr-2 flex h-8 w-8 items-center justify-center">
                    └─
                  </div>
                }
                <span> {{ node.name }} </span>
              </div>
            </mat-tree-node>
            <!-- This is the tree node template for expandable nodes -->
            <mat-tree-node
              *matTreeNodeDef="let node; when: hasChild"
              matTreeNodePaddingIndent="32"
              matTreeNodePadding
            >
              <button
                mat-icon-button
                matTreeNodeToggle
                [attr.aria-label]="'toggle ' + node.name"
              >
                <mat-icon>
                  {{ appTree.treeControl.isExpanded(node) ? 'remove' : 'add' }}
                </mat-icon>
              </button>
              <span class="font-mono"> {{ node.name }} </span>
            </mat-tree-node>
          </mat-tree>
        </div>

        <h3>src/app/core/</h3>
        <p>
          This directory is designed to contain your application's core;
          Singleton services, default configurations, default states and likes.
          It's
          <strong>NOT</strong> recommended to put any components, directives,
          pipes or simply anything has a template or related to templates in
          here.
        </p>
        <p>
          Example files that can go into this directory includes, but not
          limited to:
        </p>
        <ul>
          <li>
            <p><strong>Singleton services:</strong></p>
            <p>Auth service</p>
            <p>Logger service</p>
            <p>SplashScreen service</p>
          </li>
          <li>
            <p><strong>Guards</strong></p>
            <p>Auth guard</p>
            <p>NoAuth guard</p>
          </li>
          <li>
            <p><strong>Defaults</strong></p>
            <p>Default configurations</p>
            <p>Default state</p>
          </li>
          <li>
            <p><strong>Custom validators</strong></p>
            <p>Phone number validator</p>
            <p>Confirm validator</p>
          </li>
        </ul>
        <p>and etc...</p>

        <h3>src/app/mock-api/</h3>
        <p>
          This directory is designed to contain data services for custom made
          MockAPI library. Detailed information about this directory and the
          MockAPI library can be found in the
          <a [routerLink]="['/ui/fuse-components/libraries/mock-api']"
            >Fuse Components > Libraries > MockAPI</a
          >
          section of this documentation.
        </p>

        <h3>src/app/layout/</h3>
        <p>
          This directory designed to contain everything related to the layout of
          your app. By default, Fuse provides variety of different layout
          options for you to use.
        </p>
        <p>
          The <code>LayoutComponent</code> is an entry component and it provides
          an easy way of switching between different layouts. More information
          about how the <code>LayoutComponent</code> works can be found in the
          <a [routerLink]="['../../customization/theme-layouts']"
            >Customization > Theme layouts</a
          >
          section of this documentation.
        </p>
        <p>
          The <strong>app/layout/common/</strong> folder includes common
          components for layouts such as:
        </p>
        <ul>
          <li>Messages</li>
          <li>Notifications</li>
          <li>Search</li>
          <li>Shortcuts</li>
          <li>User Menu</li>
        </ul>
        <p>
          These components are being used across different layouts, so if you
          use multiple layouts and want to create a component, directive or a
          pipe for using within your layouts, you can put them inside the
          <strong>common</strong> folder.
        </p>

        <h3>src/app/modules/</h3>
        <p>
          This directory is designed to contain your application's feature
          modules.
        </p>
        <p>
          For example; Authentication related pages such as Sign In, Sign Up,
          Lost Password and etc. can be grouped into
          <strong>auth/</strong> directory while your main admin components and
          modules grouped into <strong>admin/</strong> directory.
        </p>
        <p>
          If you use SSR (Server Side Rendering) you can even include your
          <strong>landing</strong> page as one of the modules and keep
          everything in a single app.
        </p>

        <h2>src/styles/</h2>
        <p>This folder contains 4 different scss files:</p>
        <ul>
          <li>
            <p><strong>styles.scss</strong></p>
            <p>This file is for adding/importing global styles to the app.</p>
          </li>
          <li>
            <p><strong>tailwind.scss</strong></p>
            <p>This is the main Tailwind file for Tailwind utilities.</p>
          </li>
          <li>
            <p><strong>vendors.scss</strong></p>
            <p>
              This file is designed to import 3rd party library css/scss files
              into the project. Any style here can be overridden by
              <em>styles.scss</em> file allowing you to overwrite/modify 3rd
              party library styles and make them visually compatible with your
              app.
            </p>
            <p>
              For example, let's say you use
              <strong>FullCalendar</strong> 3rd party library. You use the
              <em>vendors.scss</em> file to import default styles of the
              FullCalendar into your project so it looks and works correctly.
              Then, you can add custom styles to the <em>styles.scss</em> file
              to overwrite those default styles to make FullCalendar compatible
              with your app's design.
            </p>
          </li>
        </ul>
      </div>
    </div>
  `,
})
export default class DirectoryStructure implements OnInit {
  appDir: any;
  appTree: any;
  generalDir: any;
  generalTree: any;

  /**
   * Constructor
   */
  constructor() {
    // App dir
    this.appDir = [
      {
        name: 'app/',
        children: [
          {
            name: 'core/',
            children: [
              { name: 'auth/' },
              { name: 'icons/' },
              { name: 'navigation/' },
              { name: 'transloco/' },
              { name: 'user/' },
            ],
          },
          {
            name: 'layout/',
            children: [
              { name: 'common/' },
              { name: 'layouts/' },
              { name: 'layout.component.html' },
              { name: 'layout.component.scss' },
              { name: 'layout.component.ts' },
            ],
          },
          {
            name: 'mock-api/',
            children: [
              { name: 'apps/' },
              { name: 'common/' },
              { name: 'dashboards/' },
              { name: 'pages/' },
              { name: 'ui/' },
              { name: 'index.ts' },
            ],
          },
          {
            name: 'modules/',
            children: [
              { name: 'admin/' },
              { name: 'auth/' },
              { name: 'landing/' },
            ],
          },
          { name: 'app.component.html' },
          { name: 'app.component.scss' },
          { name: 'app.component.ts' },
          { name: 'app.config.ts' },
          { name: 'app.resolvers.ts' },
          { name: 'app.routes.ts' },
        ],
      },
    ];

    // General dir
    this.generalDir = [
      {
        name: 'public',
        children: [
          { name: 'fonts/' },
          { name: 'i18n/' },
          { name: 'icons/' },
          { name: 'images/' },
          { name: 'styles/' },
          { name: 'favicon-16x16.png' },
          { name: 'favicon-32x32.png' },
        ],
      },
      {
        name: 'src/',
        children: [
          {
            name: '@fuse/',
            children: [
              { name: 'animations/' },
              { name: 'components/' },
              { name: 'directives/' },
              { name: 'lib/' },
              { name: 'pipes/' },
              { name: 'services/' },
              { name: 'styles/' },
              { name: 'tailwind/' },
              { name: 'validators/' },
              { name: 'version/' },
              { name: 'fuse.provider.ts' },
              { name: 'index.ts' },
            ],
          },
          this.appDir[0],
          {
            name: 'styles/',
            children: [
              { name: 'styles.scss' },
              { name: 'tailwind.scss' },
              { name: 'vendors.scss' },
            ],
          },
          { name: 'index.html' },
          { name: 'main.ts' },
        ],
      },
    ];
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.appTree = this.createTree(this.appDir);
    this.generalTree = this.createTree(this.generalDir);

    // Add 'last:true' to the last child
    this.appTree.treeControl.dataNodes.forEach(
      (node: FlatDirNode, index, nodes) => {
        nodes[index].last = false;
        if (nodes[index + 1]) {
          nodes[index].last = nodes[index + 1].level === node.level - 1;
        } else {
          nodes[index].last = true;
        }
      }
    );

    this.generalTree.treeControl.dataNodes.forEach(
      (node: FlatDirNode, index, nodes) => {
        nodes[index].last = false;
        if (nodes[index + 1]) {
          nodes[index].last = nodes[index + 1].level === node.level - 1;
        } else {
          nodes[index].last = true;
        }
      }
    );

    // Expand the tree nodes
    this.appTree.treeControl.expand(this.appTree.treeControl.dataNodes[0]);
    this.generalTree.treeControl.expand(
      this.generalTree.treeControl.dataNodes[8]
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Has child
   *
   * @param _
   * @param node
   */
  hasChild(_: number, node: DirNode): boolean {
    return node.expandable;
  }

  /**
   * Create a new tree
   */
  createTree(data): { dataSource: any; treeControl: any } {
    // Create tree control and data source
    const treeControl = new FlatTreeControl<FlatDirNode>(
      (node) => node.level,
      (node) => node.expandable
    );
    const dataSource = new MatTreeFlatDataSource(
      treeControl,
      new MatTreeFlattener(
        (node: DirNode, level: number) => ({
          expandable: !!node.children && node.children.length > 0,
          name: node.name,
          level: level,
        }),
        (node) => node.level,
        (node) => node.expandable,
        (node) => node.children
      )
    );

    // Set the data
    dataSource.data = data;

    return {
      treeControl,
      dataSource,
    };
  }
}
