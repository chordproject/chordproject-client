import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { IconsService } from './icons.service';

/**
 * Provide the icons service to the application.
 */
export const provideIcons = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      inject(IconsService);
    }),
  ]);
};
