import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AngularSplitModule } from 'angular-split';
import { ChpEditorHeaderComponent } from 'app/components/editor/editor-header/editor-header.component';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer.component';
import { EditorService } from 'app/core/chordpro/editor.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { Song } from 'app/models/song';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'song-editor',
    templateUrl: './song-editor.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        AngularSplitModule,
        MatCardModule,
        MatIconModule,
        ChpViewerComponent,
        ChpEditorComponent,
        ChpEditorHeaderComponent,
    ],
})
export class SongEditorComponent implements OnInit, OnDestroy {
    isReaderMode = false;
    songContent = '';
    song: Song = new Song();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isDarkMode: boolean;
    isMobile: boolean;
    showPrimaryArea = true;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfigService: FuseConfigService,
        private _songService: SongService,
        private _fuseConfirmationService: FuseConfirmationService,
        private editorService: EditorService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.isReaderMode = this.route.snapshot.data['mode'] === 'reader';
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                let newDarkTheme = config.scheme === 'dark';
                if (config.scheme === 'auto') {
                    newDarkTheme = document.body.classList.contains('dark');
                }
                if (this.isDarkMode !== newDarkTheme) {
                    this.isDarkMode = newDarkTheme;
                    this._changeDetectorRef.markForCheck();
                }
            });

        this._fuseMediaWatcherService
            .onMediaQueryChange$('(max-width: 959px)')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((state) => {
                this.isMobile = state.matches;
                if (!this.isMobile) {
                    this.showPrimaryArea = true;
                }
                this._changeDetectorRef.markForCheck();
            });

        const uid = this.route.snapshot.paramMap.get('uid');
        if (uid) {
            this.loadSong(uid);
        }
    }

    loadSong(uid: string): void {
        this._songService.get(uid).subscribe((data) => {
            this.song = data;
            this.song.uid = uid;
            this.songContent = data.content;
            this._changeDetectorRef.markForCheck();
        });
    }

    togglePreview(): void {
        this.showPrimaryArea = !this.showPrimaryArea;
    }

    saveSong(): void {
        const updatedSong = this.editorService.prepareSongFromContent(
            this.songContent
        );
        this.song = { ...this.song, ...updatedSong };
        this._songService.save(this.song).then((res) => {
            this.song.uid = res;
        });
    }

    removeSong(): void {
        this.editorService.confirmAndDelete(this.song).subscribe((success) => {
            if (success) {
                this.router.navigate(['/library']);
            }
            this._changeDetectorRef.markForCheck();
        });
    }

    showHelp(): void {
        // Implement help functionality
        console.log('Showing help...');
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
