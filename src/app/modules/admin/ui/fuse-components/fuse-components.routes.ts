import { Routes } from '@angular/router';
import { AlertComponent } from './components/alert/alert.component';
import { CardComponent } from './components/card/card.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { FullscreenComponent } from './components/fullscreen/fullscreen.component';
import { HighlightComponent } from './components/highlight/highlight.component';
import { LoadingBarComponent } from './components/loading-bar/loading-bar.component';
import { MasonryComponent } from './components/masonry/masonry.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ScrollResetComponent } from './directives/scroll-reset/scroll-reset.component';
import { ScrollbarComponent } from './directives/scrollbar/scrollbar.component';
import { FuseComponentsComponent } from './fuse-components.component';
import { MockApiComponent } from './libraries/mock-api/mock-api.component';
import { FindByKeyComponent } from './pipes/find-by-key/find-by-key.component';
import { ConfigComponent } from './services/config/config.component';
import { ConfirmationComponent } from './services/confirmation/confirmation.component';
import { MediaWatcherComponent } from './services/media-watcher/media-watcher.component';
import { SplashScreenComponent } from './services/splash-screen/splash-screen.component';
import { MustMatchComponent } from './validators/must-match/must-match.component';

export default [
    {
        path: '',
        component: FuseComponentsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'libraries/mock-api',
            },
            {
                path: 'libraries',
                children: [
                    {
                        path: 'mock-api',
                        component: MockApiComponent,
                    },
                ],
            },
            {
                path: 'components',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'alert',
                    },
                    {
                        path: 'alert',
                        component: AlertComponent,
                    },
                    {
                        path: 'card',
                        component: CardComponent,
                    },
                    {
                        path: 'drawer',
                        component: DrawerComponent,
                    },
                    {
                        path: 'fullscreen',
                        component: FullscreenComponent,
                    },
                    {
                        path: 'highlight',
                        component: HighlightComponent,
                    },
                    {
                        path: 'loading-bar',
                        component: LoadingBarComponent,
                    },
                    {
                        path: 'masonry',
                        component: MasonryComponent,
                    },
                    {
                        path: 'navigation',
                        component: NavigationComponent,
                    },
                ],
            },
            {
                path: 'directives',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'scrollbar',
                    },
                    {
                        path: 'scrollbar',
                        component: ScrollbarComponent,
                    },
                    {
                        path: 'scroll-reset',
                        component: ScrollResetComponent,
                    },
                ],
            },
            {
                path: 'services',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'config',
                    },
                    {
                        path: 'config',
                        component: ConfigComponent,
                    },
                    {
                        path: 'confirmation',
                        component: ConfirmationComponent,
                    },
                    {
                        path: 'splash-screen',
                        component: SplashScreenComponent,
                    },
                    {
                        path: 'media-watcher',
                        component: MediaWatcherComponent,
                    },
                ],
            },
            {
                path: 'pipes',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'find-by-key',
                    },
                    {
                        path: 'find-by-key',
                        component: FindByKeyComponent,
                    },
                ],
            },
            {
                path: 'validators',
                children: [
                    {
                        path: '',
                        pathMatch: 'full',
                        redirectTo: 'must-match',
                    },
                    {
                        path: 'must-match',
                        component: MustMatchComponent,
                    },
                ],
            },
        ],
    },
] as Routes;
