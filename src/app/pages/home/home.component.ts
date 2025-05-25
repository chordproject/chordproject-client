import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ChpSongItemComponent } from 'app/components/song-item/song-item.component';
import { SongService } from 'app/core/firebase/api/song.service';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { PartialSong } from 'app/models/partialsong';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [
        TranslocoModule,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
        SearchComponent,
        ChpSongItemComponent,
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
        this._translocoService.langChanges$.pipe(takeUntil(this._unsubscribeAll)).subscribe((lang) => {
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
        this._translocoService.selectTranslateObject('home', {}, lang).subscribe((homeTranslations) => {
            // Verificar si existe la estructura home.features
            if (homeTranslations && Array.isArray(homeTranslations.features)) {
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
