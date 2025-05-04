import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [TranslocoModule, NgFor, NgIf, MatButtonModule, MatIconModule],
})
export class HomeComponent implements OnInit, OnDestroy {
    features: string[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _translocoService: TranslocoService) {}

    ngOnInit(): void {
        // Inicializar las características basadas en el idioma actual
        this.updateFeatures(this._translocoService.getActiveLang());

        // Escuchar cambios de idioma y actualizar el array de características
        this._translocoService.langChanges$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((lang) => {
                this.updateFeatures(lang);
            });
    }

    ngOnDestroy(): void {
        // Cancelar todas las suscripciones para evitar memory leaks
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Actualiza el array de características basado en el idioma
     */
    private updateFeatures(lang: string): void {
        // Usar selectTranslateObject para obtener las traducciones completas
        this._translocoService
            .selectTranslateObject('home', {}, lang)
            .subscribe((homeTranslations) => {
                // Verificar si existe la estructura home.features
                if (
                    homeTranslations &&
                    Array.isArray(homeTranslations.features)
                ) {
                    this.features = homeTranslations.features;
                } else {
                    this.features = [];
                }
            });
    }
}
