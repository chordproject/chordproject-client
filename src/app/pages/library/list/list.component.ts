import { AsyncPipe, I18nPluralPipe } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ChpSongItemComponent } from 'app/components/song-item/song-item.component';
import { SongService } from 'app/core/firebase/api/song.service';
import { PartialSong } from 'app/models/partialsong';
import { merge, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { LibraryComponent } from '../library.component';

@Component({
    selector: 'songs-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        RouterLink,
        AsyncPipe,
        I18nPluralPipe,
        ChpSongItemComponent,
    ],
})
export class SongsListComponent implements OnInit, OnDestroy {
    songs$: Observable<PartialSong[]>;
    songsCount: number = 0;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedSong: PartialSong;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _songService: SongService,
        private _router: Router,
        private _libraryComponent: LibraryComponent 
    ) {}

    ngOnInit(): void {
        const refreshList$ = merge(
            of(''), // inicial
            this.searchInputControl.valueChanges,
            this._songService.songsChanged$ // cuando se elimina una canción
        ).pipe(
            switchMap((query: string) => {
                if (!query) {
                    return this._songService.searchByTitle();
                } else {
                    return this._songService.searchByTitle(query);
                }
            })
        );

        this.songs$ = refreshList$;

        this.songs$.pipe(takeUntil(this._unsubscribeAll)).subscribe((songs) => {
            this.songsCount = songs.length;
            this._changeDetectorRef.markForCheck();
        });

        // Get the song
        this._songService.song$.pipe(takeUntil(this._unsubscribeAll)).subscribe((song: PartialSong) => {
            // Update the selected song
            this.selectedSong = song;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });

        // Subscribe to MatDrawer opened change
        this._libraryComponent.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected song when drawer closed
                this.selectedSong = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onSongClick(song: PartialSong): void {
        // Si ya hay un drawer abierto y estamos seleccionando la misma canción, no hacer nada
        if (this.selectedSong && this.selectedSong.uid === song.uid) {
            return;
        }

        // Asegurarse de que el drawer está abierto
        this._libraryComponent.matDrawer.open();

        // Utilizar navigateByUrl con la ruta auxiliar correctamente formateada
        this._router.navigateByUrl(`/library/(drawer:${song.uid})`);
    }

    onDblClick(song: PartialSong): void {
        this._router.navigate(['/songs/read', song.uid]);
    }

    trackByFn(index: number, item: PartialSong): any {
        return item.uid || index;
    }
}
