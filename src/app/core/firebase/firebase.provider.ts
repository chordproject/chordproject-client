import {
    EnvironmentProviders,
    inject,
    provideEnvironmentInitializer,
    Provider,
} from '@angular/core';
import { FirebaseService } from 'app/core/firebase/firebase.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { environment } from 'environments/environment';

export const provideFirebase = (): Array<Provider | EnvironmentProviders> => {
    return [
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        provideEnvironmentInitializer(() => inject(FirebaseService))
    ];
};
