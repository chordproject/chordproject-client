import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SongService } from 'app/core/firebase/api/song.service';
import { PartialSong } from 'app/models/partialsong';
import { SongItemComponent } from 'app/components/song-item/song-item.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [
        TranslocoModule,
        NgFor,
        NgIf,
        AsyncPipe,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        SongItemComponent,
        RouterLink,
    ],
})
export class HomeComponent implements OnInit, OnDestroy {
    features: string[] = [];
    latestSongs$: Observable<PartialSong[]>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _translocoService: TranslocoService,
        private _songService: SongService
    ) {}

    ngOnInit(): void {
        // Get latest songs
        this.latestSongs$ = this._songService.getLatest();

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

    trackByFn(index: number, item: PartialSong): any {
        return item.uid || index;
    }
}
