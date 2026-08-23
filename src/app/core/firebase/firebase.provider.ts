import {
    EnvironmentProviders,
    inject,
    makeEnvironmentProviders,
    provideEnvironmentInitializer,
} from '@angular/core';
import { FirebaseService } from 'app/core/firebase/firebase.service';

export const provideFirebase = (): EnvironmentProviders =>
    makeEnvironmentProviders([
        provideEnvironmentInitializer(() => inject(FirebaseService)),
    ]);
