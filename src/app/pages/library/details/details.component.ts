import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { Song } from 'app/models/song';
import { LibraryComponent } from '../library.component';

@Component({
    selector: 'songs-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        ChpSongPreviewComponent,
        ChpEditorComponent,
    ],
})
export class SongsDetailsComponent implements OnInit, OnDestroy {
    editMode = false;
    song: Song;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    songContent = '';

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _libraryComponent: LibraryComponent,
        private _songsService: SongService,
        private editorService: EditorService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        // Open the drawer
        this._libraryComponent.matDrawer.open();

        // Get the song
        this._songsService.song$.pipe(takeUntil(this._unsubscribeAll)).subscribe((song: Song) => {
            this._libraryComponent.matDrawer.open();
            this.song = {
                ...song,
                tags: song?.tags ?? [],
            };
            this.songContent = song?.content || '';
            this.toggleEditMode(false);
            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._libraryComponent.matDrawer.close();
    }

    closePreview(): void {
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    }

    toggleEditMode(editMode: boolean | null = null): void {
        // Actualizar el estado según el parámetro
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Si estamos entrando en modo edición
        if (this.editMode && this.song) {
            // Asegurarnos de que songContent contiene el contenido actual
            this.songContent = this.song.content || '';

            // Forzar la detección de cambios
            this._changeDetectorRef.detectChanges();

            // Dar tiempo para que Angular actualice la vista antes de intentar modificar el DOM
            setTimeout(() => {
                this._changeDetectorRef.detectChanges();
            }, 100);
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    updateSong(): void {
        const updatedSong = this.editorService.prepareSongFromContent(this.songContent);
        this.song = {
            ...this.song,
            ...Object.fromEntries(Object.entries(updatedSong).filter(([, value]) => value !== undefined)),
        };
        this._songsService.save(this.song).then(() => {
            this.toggleEditMode(false);
        });
    }

    deleteSong(): void {
        this.editorService.confirmAndDelete(this.song).subscribe((success) => {
            if (success) {
                this._router.navigate(['../'], {
                    relativeTo: this._activatedRoute,
                });
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    openFullEditor(): void {
        if (this.song?.uid) {
            this._router.navigate(['/songs/create', this.song.uid]);
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
