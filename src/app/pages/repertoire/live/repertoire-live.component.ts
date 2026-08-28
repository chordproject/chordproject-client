import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    imports: [MatIconModule, RouterLink, TranslocoModule],
})
export class RepertoireLiveComponent implements OnInit, OnDestroy {
    repertoire: Repertoire | null = null;
    eventTypeName = '';
    slots: EventSlot[] = [];
    songs: { slot: EventSlot; song: PartialSong }[] = [];
    currentIndex = 0;
    loading = true;
    loadError = false;
    private readonly unsubscribeAll = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly repertoireService: RepertoireService,
        private readonly songService: SongService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
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
                    return forkJoin(activeAssignments.map((assignment) => this.songService.get(assignment.songId).pipe(
                        catchError(() => of(null)),
                    ))).pipe(
                        switchMap((songs) => of({ slots, activeAssignments, songs })),
                    );
                }),
                catchError(() => of(null)),
                takeUntil(this.unsubscribeAll)
            ).subscribe((result) => {
                if (!result) {
                    this.loadError = true;
                } else {
                    this.songs = result.activeAssignments.flatMap((assignment, index) => {
                        const song = result.songs[index];
                        const slot = result.slots.find((item) => item.uid === assignment.slotId);
                        return song && slot ? [{ slot, song }] : [];
                    });
                }
                this.loading = false;
                this.changeDetectorRef.markForCheck();
            });
        });
    }

    get currentSong(): PartialSong | null {
        return this.songs[this.currentIndex]?.song ?? null;
    }

    get currentSlot(): EventSlot | null {
        return this.songs[this.currentIndex]?.slot ?? null;
    }

    previous(): void {
        this.currentIndex = Math.max(0, this.currentIndex - 1);
    }

    next(): void {
        this.currentIndex = Math.min(this.songs.length - 1, this.currentIndex + 1);
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
