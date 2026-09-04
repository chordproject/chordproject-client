import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChpSongListPanelComponent } from 'app/components/song-list-panel/song-list-panel.component';
import { ChpSongPreviewComponent } from 'app/components/song-preview/song-preview.component';
import { ChpSplitLayoutComponent } from 'app/components/split-layout/split-layout.component';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { EventSlot } from 'app/models/event-slot';
import { PartialSong } from 'app/models/partialsong';
import { Repertoire } from 'app/models/repertoire';

@Component({
    selector: 'repertoire-live-page',
    standalone: true,
    templateUrl: './repertoire-live.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        RouterLink,
        TranslocoModule,
        ChpSongListPanelComponent,
        ChpSongPreviewComponent,
        ChpSplitLayoutComponent,
    ],
})
export class RepertoireLiveComponent implements OnInit, OnDestroy {
    @ViewChild(ChpSplitLayoutComponent) splitLayout: ChpSplitLayoutComponent;

    repertoire: Repertoire | null = null;
    eventTypeName = '';
    slots: EventSlot[] = [];
    songs: { slot: EventSlot; song: PartialSong }[] = [];
    songItems: PartialSong[] = [];
    selectedSong: PartialSong | null = null;
    loading = true;
    loadError = false;
    private routeSongId: string | null = null;
    private readonly unsubscribeAll = new Subject<void>();

    /** Bound as `labelFor` on `chp-song-list-panel` to show each song's space as a badge.
     *  Omitted when the event type only defines a single space, since repeating the
     *  same badge on every song adds no information. */
    getSlotLabel = (song: PartialSong): string | undefined => {
        if (this.slots.length <= 1) {
            return undefined;
        }
        return this.songs.find((item) => item.song.uid === song.uid)?.slot.name;
    };

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly repertoireService: RepertoireService,
        private readonly songService: SongService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.route.queryParamMap
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((params) => {
                this.routeSongId = params.get('song');
                this.applyRouteSongSelection();
            });

        this.route.paramMap.pipe(
            switchMap((params) => {
                const repertoireId = params.get('uid');
                return repertoireId ? this.repertoireService.getRepertoire(repertoireId) : of(null);
            }),
            catchError(() => of(null)),
            takeUntil(this.unsubscribeAll)
        ).subscribe((repertoire) => {
            if (!repertoire) {
                this.loadError = true;
                this.loading = false;
                this.changeDetectorRef.markForCheck();
                return;
            }

            this.repertoire = repertoire;
            forkJoin({
                eventType: this.repertoireService.getEventType(repertoire.eventTypeId),
                slots: this.repertoireService.getEventSlots(repertoire.eventTypeId),
                assignments: this.repertoireService.getRepertoireSongs(repertoire.uid),
            }).pipe(
                switchMap(({ eventType, slots, assignments }) => {
                    this.eventTypeName = eventType.name;
                    this.slots = slots;
                    const activeAssignments = assignments.filter((assignment) => assignment.status !== 'skipped' && assignment.songId && assignment.slotId);
                    const songIds = [...new Set(activeAssignments.map((assignment) => assignment.songId))];

                    // Existence check first: a stale/deleted songId would otherwise make songService.get() log
                    // its own console error and show an "unexpected error" toast, even though it's recoverable here.
                    return this.songService.getAll(songIds).pipe(
                        catchError(() => of([] as PartialSong[])),
                        switchMap((existingSongs) => {
                            const existingSongIds = new Set(existingSongs.map((song) => song.uid));
                            const fullSongRequests = songIds
                                .filter((songId) => existingSongIds.has(songId))
                                .map((songId) => this.songService.get(songId).pipe(catchError(() => of(null))));

                            return forkJoin(fullSongRequests.length ? fullSongRequests : [of(null)]).pipe(
                                map((songs) => ({ slots, activeAssignments, songs: songs.filter(Boolean) }))
                            );
                        })
                    );
                }),
                catchError(() => of(null)),
                takeUntil(this.unsubscribeAll)
            ).subscribe((result) => {
                if (!result) {
                    this.loadError = true;
                } else {
                    const songsById = new Map<string, PartialSong>(
                        result.songs.map((song): [string, PartialSong] => [song.uid, song])
                    );

                    this.songs = result.activeAssignments.flatMap((assignment) => {
                        const song = songsById.get(assignment.songId);
                        const slot = result.slots.find((item) => item.uid === assignment.slotId);
                        return song && slot ? [{ slot, song }] : [];
                    });
                    this.songItems = this.songs.map((item) => item.song);
                    this.selectedSong = this.routeSongId
                        ? this.songItems.find((song) => song.uid === this.routeSongId) ?? null
                        : this.songs[0]?.song ?? null;
                }
                this.loading = false;
                this.changeDetectorRef.markForCheck();
            });
        });
    }

    selectSong(song: PartialSong): void {
        this.selectedSong = song;
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { song: song.uid },
            queryParamsHandling: 'merge',
        });
        this.changeDetectorRef.markForCheck();

        if (this.splitLayout?.isMobile) {
            this.splitLayout.togglePreview();
        }
    }

    /** Index of the currently selected song within the ordered repertoire, or -1 if none. */
    get selectedIndex(): number {
        return this.selectedSong ? this.songItems.findIndex((song) => song.uid === this.selectedSong.uid) : -1;
    }

    get hasPreviousSong(): boolean {
        return this.selectedIndex > 0;
    }

    get hasNextSong(): boolean {
        return this.selectedIndex >= 0 && this.selectedIndex < this.songItems.length - 1;
    }

    goToPreviousSong(): void {
        if (this.hasPreviousSong) {
            this.selectedSong = this.songItems[this.selectedIndex - 1];
            this.changeDetectorRef.markForCheck();
        }
    }

    goToNextSong(): void {
        if (this.hasNextSong) {
            this.selectedSong = this.songItems[this.selectedIndex + 1];
            this.changeDetectorRef.markForCheck();
        }
    }

    backToList(): void {
        if (this.splitLayout?.isMobile && !this.splitLayout.showPrimaryArea) {
            this.splitLayout.togglePreview();
        }
        void this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { song: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
        });
    }

    private applyRouteSongSelection(): void {
        if (!this.songItems.length) {
            return;
        }

        const routeSong = this.routeSongId
            ? this.songItems.find((song) => song.uid === this.routeSongId) ?? null
            : null;
        if (routeSong) {
            const wasShowingAnotherSong = this.selectedSong?.uid !== routeSong.uid;
            this.selectedSong = routeSong;
            if (wasShowingAnotherSong && this.splitLayout?.isMobile && this.splitLayout.showPrimaryArea) {
                this.splitLayout.togglePreview();
            }
        } else if (!this.routeSongId && this.selectedSong) {
            this.selectedSong = null;
            if (this.splitLayout?.isMobile && !this.splitLayout.showPrimaryArea) {
                this.splitLayout.togglePreview();
            }
        }
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
