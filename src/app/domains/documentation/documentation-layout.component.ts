import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
  FuseNavigationItem,
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from '../../core/navigation/navigation.service';

@Component({
  selector: 'documentation-layout',
  standalone: true,
  imports: [
    FuseLoadingBarComponent,
    FuseVerticalNavigationComponent,
    MatIcon,
    MatIconButton,
    RouterOutlet,
  ],
  styles: `
    :host {
      display: flex;
      flex: 1 1 auto;
      width: 100%;
      max-width: 100%;
      min-width: 0;

      /* Base styles for components that load as a route */
      router-outlet {
        + * {
          position: relative;
          display: flex;
          flex: 1 1 auto;
          width: 100%;
        }
      }
    }
  `,
  template: `
    <!-- Loading bar -->
    <fuse-loading-bar></fuse-loading-bar>

    <!-- Navigation -->
    <fuse-vertical-navigation
      class="dark bg-gray-900 print:hidden"
      [mode]="isScreenSmall ? 'over' : 'side'"
      [name]="'docsNavigation'"
      [navigation]="navigation"
      [opened]="!isScreenSmall"
      #docsNav
    >
      <!-- Navigation header hook -->
      <ng-container fuseVerticalNavigationContentHeader>
        <!-- Logo -->
        <div class="flex items-center p-6">
          <img class="w-8" src="images/logo/logo.svg" alt="Logo image" />
          <div
            class="ml-3 flex flex-col items-start text-2xl font-semibold leading-none"
          >
            FUSE DOCS
          </div>
        </div>
      </ng-container>
    </fuse-vertical-navigation>

    <!-- Wrapper -->
    <div class="flex w-full min-w-0 flex-auto flex-col">
      <!-- Header -->
      <div
        class="bg-card relative z-49 flex h-16 w-full flex-0 items-center px-4 shadow dark:border-b dark:bg-transparent dark:shadow-none md:px-6 print:hidden"
      >
        <!-- Navigation toggle button -->
        <button mat-icon-button (click)="docsNav.toggle()">
          <mat-icon [svgIcon]="'heroicons_outline:bars-3'"></mat-icon>
        </button>
        <!-- Components -->
        <div
          class="ml-auto flex items-center space-x-0.5 pl-2 sm:space-x-2"
        ></div>
      </div>

      <!-- Content -->
      <div class="flex flex-auto flex-col">
        <!-- *ngIf="true" hack is required here for router-outlet to work correctly.
                     Otherwise, layout changes won't be registered and the view won't be updated! -->
        @if (true) {
          <router-outlet></router-outlet>
        }
      </div>

      <!-- Footer -->
      <div
        class="bg-card relative z-49 flex h-14 w-full flex-0 items-center justify-start border-t px-4 dark:bg-transparent md:px-6 print:hidden"
      >
        <span class="text-muted font-medium"
          >Fuse &copy; {{ currentYear }}
        </span>
      </div>
    </div>
  `,
})
export default class DocumentationLayout implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  protected isScreenSmall: boolean;
  protected navigation: FuseNavigationItem[] = [
    {
      id: 'docs.changelog',
      type: 'basic',
      title: 'Changelog',
      icon: 'heroicons_outline:megaphone',
      link: 'changelog',
      badge: {
        title: '20.0.0',
        classes: 'px-2 bg-yellow-300 text-black rounded-full',
      },
    },
    {
      id: 'docs.getting-started',
      title: 'Getting Started',
      type: 'group',
      icon: 'heroicons_outline:information-circle',
      children: [
        {
          id: 'docs.getting-started.introduction',
          title: 'Introduction',
          type: 'basic',
          link: 'getting-started/introduction',
          icon: 'heroicons_outline:play',
        },
        {
          id: 'docs.getting-started.prerequisites',
          title: 'Prerequisites',
          type: 'basic',
          link: 'getting-started/prerequisites',
          icon: 'heroicons_outline:queue-list',
        },
        {
          id: 'docs.getting-started.installation',
          title: 'Installation',
          type: 'basic',
          link: 'getting-started/installation',
          icon: 'heroicons_outline:code-bracket-square',
        },
        {
          id: 'docs.getting-started.serving',
          title: 'Serving',
          type: 'basic',
          link: 'getting-started/serving',
          icon: 'heroicons_outline:command-line',
        },
      ],
    },
    {
      id: 'docs.development',
      title: 'Development',
      type: 'group',
      icon: 'heroicons_outline:information-circle',
      children: [
        {
          id: 'docs.development.directory-structure',
          title: 'Directory structure',
          type: 'basic',
          link: 'development/directory-structure',
          icon: 'heroicons_outline:folder',
        },
        {
          id: 'docs.development.component-structure',
          title: 'Component structure',
          type: 'basic',
          link: 'development/component-structure',
          icon: 'heroicons_outline:viewfinder-circle',
        },
        {
          id: 'docs.development.starter-kit',
          title: 'Starter kit',
          type: 'basic',
          link: 'development/starter-kit',
          icon: 'heroicons_outline:paper-airplane',
        },
        {
          id: 'docs.development.deployment',
          title: 'Deployment',
          type: 'basic',
          link: 'development/deployment',
          icon: 'heroicons_outline:cloud-arrow-up',
        },
        {
          id: 'docs.development.updating',
          title: 'Updating',
          type: 'basic',
          link: 'development/updating',
          icon: 'heroicons_outline:arrow-path',
        },
      ],
    },
    {
      id: 'docs.customization',
      title: 'Customization',
      type: 'group',
      children: [
        {
          id: 'docs.customization.theme-layouts',
          title: 'Theme layouts',
          type: 'basic',
          link: 'customization/theme-layouts',
          icon: 'heroicons_outline:window',
        },
        {
          id: 'docs.customization.page-layouts',
          title: 'Page layouts',
          type: 'basic',
          link: 'customization/page-layouts',
          icon: 'heroicons_outline:rectangle-group',
        },
        {
          id: 'docs.customization.tailwindcss',
          title: 'TailwindCSS',
          type: 'basic',
          link: 'customization/tailwindcss',
          icon: 'heroicons_outline:sparkles',
        },
        {
          id: 'docs.customization.theming',
          title: 'Theming',
          type: 'basic',
          link: 'customization/theming',
          icon: 'heroicons_outline:eye-dropper',
        },
        {
          id: 'docs.customization.component-theming',
          title: 'Component theming',
          type: 'basic',
          link: 'customization/component-theming',
          icon: 'heroicons_outline:paint-brush',
        },
        {
          id: 'docs.customization.splash-screen',
          title: 'Splash screen',
          type: 'basic',
          link: 'customization/splash-screen',
          icon: 'heroicons_outline:square-2-stack',
        },
        {
          id: 'docs.customization.multi-language',
          title: 'Multi language',
          type: 'basic',
          link: 'customization/multi-language',
          icon: 'heroicons_outline:language',
        },
      ],
    },
    {
      id: 'docs.ui',
      title: 'User Interface',
      type: 'group',
      children: [
        {
          id: 'docs.ui.advanced-search',
          title: 'Advanced search',
          type: 'basic',
          link: 'ui/advanced-search',
          icon: 'heroicons_outline:magnifying-glass-circle',
        },
        {
          id: 'docs.ui.animations',
          title: 'Animations',
          type: 'basic',
          link: 'ui/animations',
          icon: 'heroicons_outline:play',
        },
        {
          id: 'docs.ui.cards',
          title: 'Cards',
          type: 'basic',
          link: 'ui/cards',
          icon: 'heroicons_outline:square-2-stack',
        },
        {
          id: 'docs.ui.colors',
          title: 'Colors',
          type: 'basic',
          link: 'ui/colors',
          icon: 'heroicons_outline:swatch',
        },
        {
          id: 'docs.ui.confirmation-dialog',
          title: 'Confirmation dialog',
          type: 'basic',
          link: 'ui/confirmation-dialog',
          icon: 'heroicons_outline:question-mark-circle',
        },
        {
          id: 'docs.ui.datatable',
          title: 'Datatable',
          type: 'basic',
          link: 'ui/datatable',
          icon: 'heroicons_outline:table-cells',
        },
        {
          id: 'docs.ui.forms',
          title: 'Forms',
          type: 'collapsable',
          icon: 'heroicons_outline:pencil-square',
          children: [
            {
              id: 'docs.ui.forms.fields',
              title: 'Fields',
              type: 'basic',
              link: '/documentation/ui/forms/fields',
            },
            {
              id: 'docs.ui.forms.layouts',
              title: 'Layouts',
              type: 'basic',
              link: '/documentation/ui/forms/layouts',
            },
            {
              id: 'docs.ui.forms.wizards',
              title: 'Wizards',
              type: 'basic',
              link: '/documentation/ui/forms/wizards',
            },
          ],
        },
        {
          id: 'docs.ui.icons',
          title: 'Icons',
          type: 'collapsable',
          icon: 'heroicons_outline:bolt',
          children: [
            {
              id: 'docs.ui.icons.heroicons-outline',
              title: 'Heroicons Outline',
              type: 'basic',
              link: '/documentation/ui/icons/heroicons-outline',
            },
            {
              id: 'docs.ui.icons.heroicons-solid',
              title: 'Heroicons Solid',
              type: 'basic',
              link: '/documentation/ui/icons/heroicons-solid',
            },
            {
              id: 'docs.ui.icons.heroicons-mini',
              title: 'Heroicons Mini',
              type: 'basic',
              link: '/documentation/ui/icons/heroicons-mini',
            },
            {
              id: 'docs.ui.icons.material-twotone',
              title: 'Material Twotone',
              type: 'basic',
              link: '/documentation/ui/icons/material-twotone',
            },
            {
              id: 'docs.ui.icons.material-outline',
              title: 'Material Outline',
              type: 'basic',
              link: '/documentation/ui/icons/material-outline',
            },
            {
              id: 'docs.ui.icons.material-solid',
              title: 'Material Solid',
              type: 'basic',
              link: '/documentation/ui/icons/material-solid',
            },
            {
              id: 'docs.ui.icons.feather',
              title: 'Feather',
              type: 'basic',
              link: '/documentation/ui/icons/feather',
            },
          ],
        },
        {
          id: 'docs.ui.page-layouts',
          title: 'Page layouts',
          type: 'collapsable',
          icon: 'heroicons_outline:rectangle-group',
          children: [
            {
              id: 'docs.ui.page-layouts.overview',
              title: 'Overview',
              type: 'basic',
              link: '/documentation/ui/page-layouts/overview',
            },
            {
              id: 'docs.ui.page-layouts.empty',
              title: 'Empty',
              type: 'basic',
              link: '/documentation/ui/page-layouts/empty',
            },
            {
              id: 'docs.ui.page-layouts.carded',

              title: 'Carded',
              type: 'collapsable',
              children: [
                {
                  id: 'docs.ui.page-layouts.carded.fullwidth',
                  title: 'Fullwidth',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/carded/fullwidth',
                },
                {
                  id: 'docs.ui.page-layouts.carded.left-sidebar-1',
                  title: 'Left Sidebar #1',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/carded/left-sidebar-1',
                },
                {
                  id: 'docs.ui.page-layouts.carded.left-sidebar-2',
                  title: 'Left Sidebar #2',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/carded/left-sidebar-2',
                },
                {
                  id: 'docs.ui.page-layouts.carded.right-sidebar-1',
                  title: 'Right Sidebar #1',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/carded/right-sidebar-1',
                },
                {
                  id: 'docs.ui.page-layouts.carded.right-sidebar-2',
                  title: 'Right Sidebar #2',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/carded/right-sidebar-2',
                },
              ],
            },
            {
              id: 'docs.ui.page-layouts.simple',
              title: 'Simple',
              type: 'collapsable',
              children: [
                {
                  id: 'docs.ui.page-layouts.simple.fullwidth-1',
                  title: 'Fullwidth #1',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/fullwidth-1',
                },
                {
                  id: 'docs.ui.page-layouts.simple.fullwidth-2',
                  title: 'Fullwidth #2',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/fullwidth-2',
                },
                {
                  id: 'docs.ui.page-layouts.simple.left-sidebar-1',
                  title: 'Left Sidebar #1',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/left-sidebar-1',
                },
                {
                  id: 'docs.ui.page-layouts.simple.left-sidebar-2',
                  title: 'Left Sidebar #2',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/left-sidebar-2',
                },
                {
                  id: 'docs.ui.page-layouts.simple.left-sidebar-3',
                  title: 'Left Sidebar #3',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/left-sidebar-3',
                },
                {
                  id: 'docs.ui.page-layouts.simple.right-sidebar-1',
                  title: 'Right Sidebar #1',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/right-sidebar-1',
                },
                {
                  id: 'docs.ui.page-layouts.simple.right-sidebar-2',
                  title: 'Right Sidebar #2',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/right-sidebar-2',
                },
                {
                  id: 'docs.ui.page-layouts.simple.right-sidebar-3',
                  title: 'Right Sidebar #3',
                  type: 'basic',
                  link: '/documentation/ui/page-layouts/simple/right-sidebar-3',
                },
              ],
            },
          ],
        },
        {
          id: 'docs.ui.typography',
          title: 'Typography',
          type: 'basic',
          link: 'ui/typography',
          icon: 'heroicons_outline:pencil',
        },
      ],
    },
    {
      id: 'docs.authentication',
      title: 'Authentication',
      type: 'group',
      children: [
        {
          id: 'docs.authentication.jwt',
          title: 'JWT',
          type: 'basic',
          link: 'authentication/jwt',
          icon: 'heroicons_outline:lock-closed',
        },
      ],
    },
    {
      id: 'docs.components',
      title: 'Components',
      type: 'group',
      children: [
        {
          id: 'docs.components.material',
          title: 'Angular Material',
          type: 'basic',
          link: 'components/angular-material-components',
          icon: 'heroicons_outline:square-3-stack-3d',
        },
        {
          id: 'docs.components.fuse',
          title: 'Fuse Components',
          type: 'collapsable',
          icon: 'heroicons_outline:square-3-stack-3d',
          children: [
            {
              id: 'docs.components.fuse.libraries.mock-api',
              title: 'MockAPI',
              type: 'basic',
              link: '/documentation/components/fuse-components/libraries/mock-api',
              badge: {
                title: 'Lib',
                classes: 'px-2 bg-blue-300 text-black rounded-full',
              },
            },
            {
              id: 'docs.components.fuse.components',
              title: 'Components',
              type: 'group',
              icon: 'heroicons_outline:information-circle',
              classes: {
                title: 'normal-case font-medium',
              },
              children: [
                {
                  id: 'docs.components.fuse.components.alert',
                  title: 'Alert',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/alert',
                },
                {
                  id: 'docs.components.fuse.components.card',
                  title: 'Card',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/card',
                },
                {
                  id: 'docs.components.fuse.components.drawer',
                  title: 'Drawer',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/drawer',
                },
                {
                  id: 'docs.components.fuse.components.fullscreen',
                  title: 'Fullscreen',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/fullscreen',
                },
                {
                  id: 'docs.components.fuse.components.highlight',
                  title: 'Highlight',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/highlight',
                },
                {
                  id: 'docs.components.fuse.components.loading-bar',
                  title: 'Loading Bar',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/loading-bar',
                },
                {
                  id: 'docs.components.fuse.components.masonry',
                  title: 'Masonry',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/masonry',
                },
                {
                  id: 'docs.components.fuse.components.navigation',
                  title: 'Navigation',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/components/navigation',
                },
              ],
            },
            {
              id: 'docs.components.fuse.directives',
              title: 'Directives',
              type: 'group',
              icon: 'heroicons_outline:information-circle',
              classes: {
                title: 'normal-case font-medium',
              },
              children: [
                {
                  id: 'docs.components.fuse.directives.scrollbar',
                  title: 'Scrollbar',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/directives/scrollbar',
                },
                {
                  id: 'docs.components.fuse.directives.scroll-reset',
                  title: 'ScrollReset',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/directives/scroll-reset',
                },
              ],
            },
            {
              id: 'docs.components.fuse.services',
              title: 'Services',
              type: 'group',
              icon: 'heroicons_outline:information-circle',
              classes: {
                title: 'normal-case font-medium',
              },
              children: [
                {
                  id: 'docs.components.fuse.services.config',
                  title: 'Config',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/services/config',
                },
                {
                  id: 'docs.components.fuse.services.confirmation',
                  title: 'Confirmation',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/services/confirmation',
                },
                {
                  id: 'docs.components.fuse.services.splash-screen',
                  title: 'SplashScreen',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/services/splash-screen',
                },
                {
                  id: 'docs.components.fuse.services.media-watcher',
                  title: 'MediaWatcher',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/services/media-watcher',
                },
              ],
            },
            {
              id: 'docs.components.fuse.pipes',
              title: 'Pipes',
              type: 'group',
              icon: 'heroicons_outline:information-circle',
              classes: {
                title: 'normal-case font-medium',
              },
              children: [
                {
                  id: 'docs.components.fuse.pipes.find-by-key',
                  title: 'FindByKey',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/pipes/find-by-key',
                },
              ],
            },
            {
              id: 'docs.components.fuse.validators',
              title: 'Validators',
              type: 'group',
              icon: 'heroicons_outline:information-circle',
              classes: {
                title: 'normal-case font-medium',
              },
              children: [
                {
                  id: 'docs.components.fuse.validators.must-match',
                  title: 'MustMatch',
                  type: 'basic',
                  link: '/documentation/components/fuse-components/validators/must-match',
                },
              ],
            },
          ],
        },
        {
          id: 'docs.components.other',
          title: 'Other Components',
          type: 'collapsable',
          icon: 'heroicons_outline:square-3-stack-3d',
          children: [
            {
              id: 'docs.components.other.common',
              title: 'Common',
              type: 'group',
              classes: {
                title: 'normal-case font-medium',
              },
              children: [
                {
                  id: 'docs.components.other.common.overview',
                  title: 'Overview',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/overview',
                },
                {
                  id: 'docs.components.other.common.languages',
                  title: 'Languages',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/languages',
                },
                {
                  id: 'docs.components.other.common.messages',
                  title: 'Messages',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/messages',
                },
                {
                  id: 'docs.components.other.common.notifications',
                  title: 'Notifications',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/notifications',
                },
                {
                  id: 'docs.components.other.common.quick-chat',
                  title: 'Quick chat',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/quick-chat',
                },
                {
                  id: 'docs.components.other.common.search',
                  title: 'Search',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/search',
                },
                {
                  id: 'docs.components.other.common.shortcuts',
                  title: 'Shortcuts',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/shortcuts',
                },
                {
                  id: 'docs.components.other.common.user',
                  title: 'User',
                  type: 'basic',
                  link: '/documentation/components/other-components/common/user',
                },
              ],
            },
            {
              id: 'docs.components.other.third-party',
              title: 'Third party',
              type: 'group',
              classes: {
                title: 'normal-case font-medium',
              },
              children: [
                {
                  id: 'docs.components.other.third-party.apex-charts',
                  title: 'ApexCharts',
                  type: 'basic',
                  link: '/documentation/components/other-components/third-party/apex-charts',
                },
                {
                  id: 'docs.components.other.third-party.quill-editor',
                  title: 'Quill editor',
                  type: 'basic',
                  link: '/documentation/components/other-components/third-party/quill-editor',
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _navigationService: NavigationService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to navigation data
    /*this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });*/

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        name
      );

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }
}
