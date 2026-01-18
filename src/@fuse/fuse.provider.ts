import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  EnvironmentProviders,
  Provider,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideEnvironmentInitializer,
} from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FUSE_MOCK_API_DEFAULT_DELAY,
  mockApiInterceptor,
} from '@fuse/lib/mock-api';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
  FuseLoadingService,
  fuseLoadingInterceptor,
} from '@fuse/services/loading';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseUtilsService } from '@fuse/services/utils';

export type FuseProviderConfig = {
  mockApi?: {
    delay?: number;
    service?: any;
  };
};

/**
 * Fuse provider
 */
export const provideFuse = (
  config: FuseProviderConfig
): (Provider | EnvironmentProviders)[] => {
  // Base providers
  const providers: (Provider | EnvironmentProviders)[] = [
    {
      provide: FUSE_MOCK_API_DEFAULT_DELAY,
      useValue: 0,
    },

    importProvidersFrom(MatDialogModule),
    provideEnvironmentInitializer(() => inject(FuseConfirmationService)),

    provideHttpClient(withInterceptors([fuseLoadingInterceptor])),
    provideEnvironmentInitializer(() => inject(FuseLoadingService)),

    provideEnvironmentInitializer(() => inject(FuseMediaWatcherService)),
    // provideEnvironmentInitializer(() => inject(FuseSplashScreenService)),
    provideEnvironmentInitializer(() => inject(FuseUtilsService)),
  ];

  // Mock Api services
  if (config?.mockApi?.service) {
    providers.push(
      provideHttpClient(withInterceptors([mockApiInterceptor])),
      provideAppInitializer(() => {
        const mockApiService = inject(config.mockApi.service);
      })
    );
  }

  // Return the providers
  return providers;
};
