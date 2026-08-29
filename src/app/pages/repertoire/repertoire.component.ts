import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, forkJoin, of, takeUntil } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { EventType } from 'app/models/event-type';
import { Repertoire } from 'app/models/repertoire';

@Component({
    selector: 'repertoire-page',
    standalone: true,
    templateUrl: './repertoire.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTooltipModule,
        RouterLink,
        TranslocoModule,
    ],
})
export class RepertoireComponent implements OnInit, OnDestroy {
    eventTypes: EventType[] = [];
    repertoires: Repertoire[] = [];
    repertoireSongsMap: Record<string, { slotName?: string; songTitle: string }[]> = {};
    repertoireSearchTerm = '';
    viewMode: 'grid' | 'list' = 'grid';
    newRepertoireEventTypeId: string | null = null;
    newRepertoireTitle = '';
    newRepertoireDescription = '';
    newRepertoireDate = new Date();
    loading = false;
    private readonly unsubscribeAll = new Subject<void>();

    constructor(
        private readonly repertoireService: RepertoireService,
        private readonly songService: SongService,
        private readonly confirmationService: FuseConfirmationService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadEventTypes();
        this.loadRepertoires();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    loadEventTypes(): void {
        this.repertoireService
            .getEventTypes()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((eventTypes) => {
                this.eventTypes = eventTypes;
                if (!this.newRepertoireEventTypeId && eventTypes.length) {
                    this.newRepertoireEventTypeId = eventTypes[0].uid;
                }
                this.changeDetectorRef.markForCheck();
            });
    }

    loadRepertoires(): void {
        this.repertoireService
            .getRepertoires()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((repertoires) => {
                this.repertoires = repertoires;
                this.loadSongsSummaries(repertoires);
                this.changeDetectorRef.markForCheck();
            });
    }

    private loadSongsSummaries(repertoires: Repertoire[]): void {
        if (!repertoires.length) {
            this.repertoireSongsMap = {};
            return;
        }

        const repertoireRequests = repertoires.map((repertoire) =>
            forkJoin({
                slots: this.repertoireService.getEventSlots(repertoire.eventTypeId).pipe(catchError(() => of([]))),
                assignments: this.repertoireService.getRepertoireSongs(repertoire.uid).pipe(catchError(() => of([]))),
            }).pipe(
                map(({ slots, assignments }) => ({ repertoire, slots, assignments })),
                catchError(() => of({ repertoire, slots: [], assignments: [] }))
            )
        );

        forkJoin(repertoireRequests)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((results) => {
                const allSongIds = new Set<string>();
                results.forEach((res) => {
                    if (res?.assignments) {
                        res.assignments
                            .filter((a) => a.status !== 'skipped' && a.songId && a.songId !== '__skipped__')
                            .forEach((a) => allSongIds.add(a.songId));
                    }
                });

                if (!allSongIds.size) {
                    this.repertoireSongsMap = {};
                    this.changeDetectorRef.markForCheck();
                    return;
                }

                const songRequests = Array.from(allSongIds).map((songId) =>
                    this.songService.get(songId).pipe(
                        map((song) => ({ songId, title: song?.title || '' })),
                        catchError(() => of({ songId, title: '' }))
                    )
                );

                forkJoin(songRequests)
                    .pipe(takeUntil(this.unsubscribeAll))
                    .subscribe((songTitlesList) => {
                        const titleMap = new Map<string, string>();
                        songTitlesList.forEach((item) => {
                            if (item?.songId) {
                                titleMap.set(item.songId, item.title);
                            }
                        });

                        const summaryMap: Record<string, { slotName?: string; songTitle: string }[]> = {};
                        results.forEach((res) => {
                            if (!res?.repertoire) return;
                            const items: { slotName?: string; songTitle: string }[] = [];
                            const activeAssignments = res.assignments.filter(
                                (a) => a.status !== 'skipped' && a.songId && a.songId !== '__skipped__'
                            );
                            activeAssignments.forEach((assignment) => {
                                const slot = res.slots.find((s) => s.uid === assignment.slotId);
                                const title = titleMap.get(assignment.songId);
                                if (title) {
                                    items.push({
                                        slotName: slot?.name,
                                        songTitle: title,
                                    });
                                }
                            });
                            summaryMap[res.repertoire.uid] = items;
                        });

                        this.repertoireSongsMap = summaryMap;
                        this.changeDetectorRef.markForCheck();
                    });
            });
    }

    getRepertoireSongsSummary(repertoireId: string): { slotName?: string; songTitle: string }[] {
        return this.repertoireSongsMap[repertoireId] || [];
    }

    async createRepertoire(): Promise<void> {
        const title = this.newRepertoireTitle.trim();
        const description = this.newRepertoireDescription.trim();
        if (!title || !this.newRepertoireEventTypeId || !this.newRepertoireDate) {
            return;
        }

        const uid = await this.repertoireService.saveRepertoire({
            eventTypeId: this.newRepertoireEventTypeId,
            title,
            description: description || undefined,
            date: this.newRepertoireDate,
        } as Repertoire);
        if (uid) {
            this.newRepertoireTitle = '';
            this.newRepertoireDescription = '';
            this.loadRepertoires();
        }
    }

    deleteRepertoire(repertoire: Repertoire, event?: MouseEvent): void {
        event?.stopPropagation();
        if (!repertoire.uid) {
            return;
        }

        this.confirmationService
            .open({
                title: 'repertoire_page.delete_repertoire_confirm_title',
                message: 'repertoire_page.delete_repertoire_confirm_message',
                icon: {
                    name: 'trash-2',
                    color: 'error',
                },
                actions: {
                    confirm: {
                        label: 'repertoire_page.delete_repertoire',
                        color: 'error',
                    },
                    cancel: {
                        label: 'repertoire_page.cancel_edit',
                    },
                },
            })
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(async (result) => {
                if (result === 'confirmed' && repertoire.uid) {
                    const success = await this.repertoireService.deleteRepertoire(repertoire.uid);
                    if (success) {
                        this.loadRepertoires();
                    }
                }
            });
    }

    trackByUid(_index: number, item: { uid: string }): string {
        return item.uid;
    }

    getEventTypeName(eventTypeId: string): string {
        return this.eventTypes.find((eventType) => eventType.uid === eventTypeId)?.name || '';
    }

    get filteredRepertoires(): Repertoire[] {
        const term = this.normalize(this.repertoireSearchTerm);
        const filtered = !term
            ? this.repertoires
            : this.repertoires.filter((repertoire) => {
                const matchesTitle = this.normalize(repertoire.title).includes(term);
                const matchesDesc = this.normalize(repertoire.description ?? '').includes(term);
                const matchesType = this.normalize(this.getEventTypeName(repertoire.eventTypeId)).includes(term);
                const songs = this.repertoireSongsMap[repertoire.uid] || [];
                const matchesSongs = songs.some(
                    (item) =>
                        this.normalize(item.songTitle).includes(term) ||
                        (item.slotName && this.normalize(item.slotName).includes(term))
                );
                return matchesTitle || matchesDesc || matchesType || matchesSongs;
            });

        return [...filtered].sort((first, second) => this.getTime(second.date) - this.getTime(first.date));
    }

    private getTime(value: unknown): number {
        if (!value) return 0;
        if (value instanceof Date) return value.getTime();
        if (typeof (value as any).toDate === 'function') return (value as any).toDate().getTime();
        if (typeof value === 'string' || typeof value === 'number') {
            const time = new Date(value).getTime();
            return isNaN(time) ? 0 : time;
        }
        return 0;
    }

    /** Accent-insensitive comparison so "biblica"/"bíblica" or "misa"/"Misa" match the same way. */
    private normalize(value: string): string {
        return value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
}
