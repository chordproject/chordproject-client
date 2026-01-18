import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { SplashScreenService } from '@/app/core/splash-screen/splash-screen';

/**
 * Provide the splash screen service to the application.
 */
export const provideSplashScreen = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      inject(SplashScreenService);
    }),
  ]);
};
