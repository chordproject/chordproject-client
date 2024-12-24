import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  isDevMode,
  provideAppInitializer,
} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { TranslocoService, provideTransloco } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { provideFuse } from '@fuse';
import { appRoutes } from './app.routes';
import { provideAuth } from './core/auth/auth.provider';
import { provideIcons } from './core/icons/icons.provider';
import { provideTheme } from './core/theme/theme.provider';
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
    provideAuth(),
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
    // FUSE v20.0.0
    // ------------------------------------------------

    provideIcons(),
    provideTheme([
      {
        name: 'default',
        primaryColor: '#4f46e5',
      },
      {
        name: 'teal',
        primaryColor: '#0d9488',
      },
      {
        name: 'rose',
        primaryColor: '#e11d48',
      },
      {
        name: 'purple',
        primaryColor: '#9333ea',
      },
      {
        name: 'amber',
        primaryColor: '#facc15',
      },
    ]),
  ],
};
