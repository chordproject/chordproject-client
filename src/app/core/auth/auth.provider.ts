import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';

/**
 * Provide the authentication service and HTTP client with the authentication
 * interceptor.
 */
export const provideAuth = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAppInitializer(() => {
      inject(AuthService);
    }),
  ]);
};
