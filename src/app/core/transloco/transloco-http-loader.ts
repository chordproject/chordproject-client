import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { forkJoin, map } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  private readonly translationRequestOptions = {
    headers: new HttpHeaders({ 'Cache-Control': 'no-cache' }),
  };

  getTranslation(lang: string) {
    const brandTranslations = this.http.get<Translation>(
      `./${environment.brand}/i18n/${lang}.json`,
      this.translationRequestOptions
    );

    if (environment.brand === 'chp') {
      return brandTranslations;
    }

    return forkJoin({
      brand: brandTranslations,
      common: this.http.get<Translation>(
        `./chp/i18n/${lang}.json`,
        this.translationRequestOptions
      ),
    }).pipe(map(({ brand, common }) => this.mergeTranslations(common, brand)));
  }

  private mergeTranslations(common: Translation, brand: Translation): Translation {
    const merged = { ...common } as Record<string, unknown>;

    Object.entries(brand).forEach(([key, value]) => {
      const commonValue = merged[key];

      if (
        value &&
        typeof value === 'object' &&
        Array.isArray(value) === false &&
        commonValue &&
        typeof commonValue === 'object' &&
        Array.isArray(commonValue) === false
      ) {
        merged[key] = this.mergeTranslations(
          commonValue as Translation,
          value as Translation
        );
      } else {
        merged[key] = value;
      }
    });

    return merged as Translation;
  }
}
