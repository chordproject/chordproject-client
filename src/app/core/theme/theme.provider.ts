import {
  EnvironmentProviders,
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { ThemeService } from './theme.service';

export interface ThemeConfig {
  name: string;
  primaryColor: string;
  secondaryColor?: string;
  neutralColor?: string;
}

/**
 * Injection token for the theme configuration.
 */
export const FUSE_THEME_CONFIG = new InjectionToken<ThemeConfig[]>(
  'FUSE_THEME_CONFIG'
);

/**
 * Provide the theme configuration to the application.
 * @param config
 */
export const provideTheme = (config: ThemeConfig[]): EnvironmentProviders => {
  // Make sure there is exactly one theme named 'default'
  if (config.filter((theme) => theme.name === 'default').length !== 1) {
    throw new Error(
      'You must provide exactly one theme named "default". Check your `provideTheme()` call and make sure you have a theme named "default".'
    );
  }

  // Make sure all theme names are unique
  const themeNames = config.map((theme) => theme.name);
  if (new Set(themeNames).size !== themeNames.length) {
    throw new Error(
      'Theme names must be unique! Check your `provideTheme()` call and make sure you have unique theme names.'
    );
  }

  return makeEnvironmentProviders([
    {
      provide: FUSE_THEME_CONFIG,
      useValue: config,
    },
    provideAppInitializer(() => {
      inject(ThemeService);
    }),
  ]);
};
