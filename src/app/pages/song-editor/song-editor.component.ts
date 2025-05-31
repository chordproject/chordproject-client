import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewContainerRef,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { Song } from 'app/models/song';
import { Observable, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
    selector: 'song-editor',
    standalone: true,
    templateUrl: './song-editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCardModule, ChpSplitLayoutComponent, ChpViewerComponent, ChpEditorComponent],
})
export class SongEditorComponent implements OnInit, OnDestroy {
    isReaderMode = false;
    songContent = '';
    song$: Observable<Song>;
    private _song: Song = new Song();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _viewContainerRef: ViewContainerRef,
        private _songService: SongService,
        private editorService: EditorService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        const mode = this.route.snapshot.data['mode'];

        // Siempre limpiar las referencias, sin importar el modo
        this.cleanupTemplateRefs();

        this.isReaderMode = mode === 'reader';
        this.loadSong();
    }

    private loadSong(): void {
        this.route.paramMap
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((params) => {
                    const uid = params.get('uid');
                    if (uid) {
                        return this._songService.get(uid);
                    }
                    return [];
                })
            )
            .subscribe((data) => {
                if (data) {
                    this._song = data;
                    this._song.uid = this.route.snapshot.paramMap.get('uid');
                    this.songContent = data.content;
                    this._changeDetectorRef.markForCheck();
                }
            });
    }

    // Evita el error de editor no visible si viene desde el editor de la librería
    private cleanupTemplateRefs(): void {
        const editors = document.querySelectorAll('chp-editor');

        if (editors.length > 0) {
            this._viewContainerRef.clear();

            editors.forEach((editor) => {
                const parent = editor.parentElement;
                if (parent) parent.removeChild(editor);
            });

            setTimeout(() => {
                this._changeDetectorRef.detectChanges();
            }, 50);
        }
    }

    saveSong(): void {
        const updatedSong = this.editorService.prepareSongFromContent(this.songContent);
        this._song = { ...this._song, ...updatedSong };
        this._songService.save(this._song).then((res) => {
            this._song.uid = res;
        });
    }

    removeSong(): void {
        this.editorService.confirmAndDelete(this._song).subscribe((success) => {
            if (success) {
                this.router.navigate(['/library']);
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    showHelp(): void {
        // Implement help functionality
    }

    onEditorClose() {
        if (this._song?.uid) {
            this.router.navigate(['/songs/read', this._song.uid]);
        }
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
