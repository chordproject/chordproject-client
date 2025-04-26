import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation, Inject, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SongService } from 'app/core/firebase/api/song.service';
import { Observable, Subject, takeUntil, switchMap, startWith, filter, fromEvent } from 'rxjs';
import {  AsyncPipe, DOCUMENT, I18nPluralPipe, NgClass } from '@angular/common';
import { Router,  ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { PartialSong } from 'app/models/partialsong';

@Component({
    selector: 'songs-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatSidenavModule,
        RouterOutlet,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        NgClass,
        RouterLink,
        AsyncPipe,
        I18nPluralPipe,
    ],
})
export class SongsListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    songs$: Observable<PartialSong[]>;
    songsCount: number = 0;
    songsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    drawerMode: 'side' | 'over';
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    selectedSong: PartialSong;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _songService: SongService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    ) {}

    ngOnInit(): void {
        this.songs$ = this.searchInputControl.valueChanges.pipe(
            startWith(''),
            switchMap((query: string) => {
                if (!query) {
                    return this._songService.getList();
                } else {
                    return this._songService.getList(query);
                }
            })
        );

        this.songs$.pipe(takeUntil(this._unsubscribeAll)).subscribe(songs => {
            this.songsCount = songs.length;
            this._changeDetectorRef.markForCheck();
        });        

        // // Get the song
        // this._songService.song$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((song: Song) => {
        //         // Update the selected song
        //         this.selectedSong = song;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });

        // // Subscribe to search input field value changes
        // this.searchInputControl.valueChanges
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         switchMap((query) =>
        //             // Search
        //             this._songService.searchSongs(query)
        //         )
        //     )
        //     .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected song when drawer closed
                this.selectedSong = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode if the given breakpoint is active
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                } else {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(
                    (event) =>
                        (event.ctrlKey === true || event.metaKey) && // Ctrl or Cmd
                        event.key === '/' // '/'
                )
            )
            .subscribe(() => {
                this.createSong();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    createSong(): void {
        // Create the song
        // this._songService.createSong().subscribe((newSong) => {
        //     // Go to the new song
        //     this._router.navigate(['./', newSong.id], {
        //         relativeTo: this._activatedRoute,
        //     });

        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        // });
    }

    trackByFn(index: number, item: PartialSong): any {
                return item.uid || index;
            }
}
