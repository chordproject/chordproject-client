import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideIcons } from '@/app/core/icons/provider';
import { provideTheming } from '@/app/core/theming';
import { TranslocoHttpLoader } from '@/app/core/transloco/transloco-http-loader';
import { provideFirebase } from 'app/core/firebase/firebase.provider';
import { routes } from './app.routes';

const supportedLanguages = ['es', 'en', 'fr'];

function getInitialLanguage(): string {
  try {
    const storedLanguage = globalThis.localStorage?.getItem('language');
    if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // localStorage may be unavailable during server rendering or privacy mode.
  }

  const browserLanguage = globalThis.navigator?.language?.split('-')[0];
  return supportedLanguages.includes(browserLanguage) ? browserLanguage : 'en';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
    ),

    // Material
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
    provideNativeDateAdapter(),

    // Core
    provideIcons(),
    provideFirebase(),
    provideTheming({
      scheme: 'system',
      primary: '#1565C0',
      error: '#dc2626',
    }),

    // Third-party
    provideTransloco({
      config: {
        availableLangs: [
          {
            id: 'es',
            label: 'Español',
          },
          {
            id: 'en',
            label: 'English',
          },
          {
            id: 'fr',
            label: 'Français',
          },
        ],
        defaultLang: getInitialLanguage(),
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
