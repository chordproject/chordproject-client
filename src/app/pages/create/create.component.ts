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
import { ActivatedRoute } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { AngularSplitModule } from 'angular-split';
import { EditorHeaderComponent } from 'app/components/editor/editor-header/editor-header.component';
import { ChpEditorComponent } from 'app/components/editor/editor/editor.component';
import { ChpViewerComponent } from 'app/components/viewer/viewer.component';
import { SongService } from 'app/core/firebase/api/song.service';
import { Song } from 'app/models/song';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AngularSplitModule,
        MatCardModule,
        MatIconModule,
        ChpViewerComponent,
        ChpEditorComponent,
        EditorHeaderComponent,
    ],
})
export class CreateComponent implements OnInit, OnDestroy {
    songContent = '';
    song: Song;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isDarkMode: boolean;
    isMobile: boolean;
    showPrimaryArea = true;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseConfigService: FuseConfigService,
        private _songService: SongService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
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
        // Implement save functionality
        console.log('Saving song...');
    }

    removeSong(): void {
        // Implement delete functionality
        console.log('Removing song...');
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
