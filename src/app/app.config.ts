import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { TranslocoService, provideTransloco } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { provideIcons } from '@/app/core/icons/provider';
import { provideSplashScreen } from '@/app/core/splash-screen/splash-screen.provider';
import { provideTheme } from '@/app/core/theme/theme.provider';
import { provideTheming } from '@/app/core/theming';
import { provideFuse } from '@fuse';
import { appRoutes } from './app.routes';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';
import { MockApiService } from './mock-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // Material Date Adapter
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'D',
        },
        display: {
          dateInput: 'DDD',
          monthYearLabel: 'LLL yyyy',
          dateA11yLabel: 'DD',
          monthYearA11yLabel: 'LLLL yyyy',
        },
      },
    },

    // Transloco Config
    provideTransloco({
      config: {
        availableLangs: [
          {
            id: 'en',
            label: 'English',
          },
          {
            id: 'tr',
            label: 'Turkish',
          },
        ],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const translocoService = inject(TranslocoService);
      const defaultLang = translocoService.getDefaultLang();
      translocoService.setActiveLang(defaultLang);

      return firstValueFrom(translocoService.load(defaultLang));
    }),

    // Fuse
    provideFuse({
      mockApi: {
        delay: 0,
        service: MockApiService,
      },
      fuse: {
        layout: 'classy',
        scheme: 'light',
        screens: {
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1440px',
        },
        theme: 'theme-default',
        themes: [
          {
            id: 'theme-default',
            name: 'Default',
          },
          {
            id: 'theme-brand',
            name: 'Brand',
          },
          {
            id: 'theme-teal',
            name: 'Teal',
          },
          {
            id: 'theme-rose',
            name: 'Rose',
          },
          {
            id: 'theme-purple',
            name: 'Purple',
          },
          {
            id: 'theme-amber',
            name: 'Amber',
          },
        ],
      },
    }),

    // ------------------------------------------------
    // FUSE v21.0.0
    // ------------------------------------------------

    provideSplashScreen(),
    provideIcons(),
    provideTheme([
      {
        name: 'default',
        primary: '#4f46e5',
      },
      {
        name: 'teal',
        primary: '#0d9488',
      },
      {
        name: 'rose',
        primary: '#e11d48',
      },
      {
        name: 'purple',
        primary: '#9333ea',
      },
      {
        name: 'amber',
        primary: '#facc15',
      },
    ]),

    provideTheming({
      scheme: 'system',
      primary: '#4f46e5',
      error: '#dc2626',
    }),
  ],
};
