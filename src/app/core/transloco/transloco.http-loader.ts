import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  // Dependencies
  private httpClient = inject(HttpClient);

  getTranslation(lang: string) {
    return this.httpClient.get<Translation>(`./i18n/${lang}.json`);
  }
}
