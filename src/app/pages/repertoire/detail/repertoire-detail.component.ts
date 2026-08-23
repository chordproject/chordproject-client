import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { EventSlot } from 'app/models/event-slot';
import { PartialSong } from 'app/models/partialsong';
import { Repertoire } from 'app/models/repertoire';
import { RepertoireSong } from 'app/models/repertoire-song';

@Component({
    selector: 'repertoire-detail-page',
    standalone: true,
    templateUrl: './repertoire-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterLink,
        TranslocoModule,
    ],
})
export class RepertoireDetailComponent implements OnInit, OnDestroy {
    repertoire: Repertoire | null = null;
    eventTypeName = '';
    slots: EventSlot[] = [];
    songSearchResults: Record<string, PartialSong[]> = {};
    assignedSongTitles: Record<string, string> = {};
    assignedSongIds: Record<string, string> = {};
    assignedSongs: Record<string, PartialSong[]> = {};
    assignmentIds: Record<string, Record<string, string>> = {};
    skippedSlotIds = new Set<string>();
    songSearchControls: Record<string, UntypedFormControl> = {};
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
        this.route.paramMap
            .pipe(
                switchMap((params) => {
                    const repertoireId = params.get('uid');
                    if (!repertoireId) {
                        return of(null);
                    }

                    return this.repertoireService.getRepertoire(repertoireId).pipe(catchError(() => of(null)));
                }),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe((result) => {
                if (!result) {
                    this.loadError = true;
                    this.loading = false;
                    this.changeDetectorRef.detectChanges();
                    return;
                }

                this.repertoire = result;
                forkJoin({
                    eventType: this.repertoireService.getEventType(this.repertoire.eventTypeId).pipe(catchError(() => of(null))),
                    slots: this.repertoireService
                        .getEventSlots(this.repertoire.eventTypeId)
                        .pipe(catchError(() => of([]))),
                    repertoireSongs: this.repertoireService
                        .getRepertoireSongs(this.repertoire.uid)
                        .pipe(catchError(() => of([]))),
                })
                    .pipe(takeUntil(this.unsubscribeAll))
                    .subscribe((repertoireSongs) => {
                        if (!repertoireSongs.eventType) {
                            this.loadError = true;
                            this.loading = false;
                            this.changeDetectorRef.detectChanges();
                            return;
                        }
                        this.eventTypeName = repertoireSongs.eventType.name;
                        this.slots = repertoireSongs.slots;
                        const assignments = repertoireSongs.repertoireSongs.filter(
                            (item) => item.slotId && item.songId && item.status !== 'skipped'
                        );
                        this.assignedSongIds = Object.fromEntries(
                            assignments.map((item) => [item.slotId, item.songId])
                        );
                        this.assignmentIds = Object.fromEntries(
                            this.slots.map((slot) => [
                                slot.uid,
                                Object.fromEntries(
                                    assignments
                                        .filter((item) => item.slotId === slot.uid)
                                        .map((item) => [item.songId, item.uid])
                                ),
                            ])
                        );
                        this.skippedSlotIds = new Set(
                            repertoireSongs.repertoireSongs
                                .filter((item) => item.slotId && item.status === 'skipped')
                                .map((item) => item.slotId)
                        );
                        const assignedSongIds = [...new Set(assignments.map((item) => item.songId))];
                        const titleRequests = assignedSongIds.map((songId) =>
                            this.songService.get(songId).pipe(catchError(() => of(null)))
                        );
                        forkJoin(titleRequests.length ? titleRequests : [of(null)])
                            .pipe(takeUntil(this.unsubscribeAll))
                            .subscribe((assignedSongs) => {
                                assignedSongs.filter(Boolean).forEach((song) => {
                                    this.assignedSongTitles[song.uid] = song.title || '';
                                });
                                const songsById = new Map(
                                    assignedSongs.filter(Boolean).map((song) => [song.uid, song])
                                );
                                this.slots.forEach((slot) => {
                                    this.assignedSongs[slot.uid] = assignments
                                        .filter((item) => item.slotId === slot.uid)
                                        .map((item) => songsById.get(item.songId))
                                        .filter(Boolean);
                                    this.setupSongSearch(slot);
                                });
                                this.loading = false;
                                this.changeDetectorRef.detectChanges();
                            });
                    });
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    async assignSong(slot: EventSlot, song: PartialSong): Promise<void> {
        if (!this.repertoire?.uid || !song?.uid) {
            return;
        }

        const uid = await this.repertoireService.saveRepertoireSong({
            uid: `${this.repertoire.uid}_${slot.uid}_${song.uid}`,
            repertoireId: this.repertoire.uid,
            songId: song.uid,
            slotId: slot.uid,
            order: slot.order,
            songOrder: this.assignedSongs[slot.uid]?.length || 0,
            status: 'assigned',
        } as RepertoireSong);
        if (uid) {
            this.skippedSlotIds.delete(slot.uid);
            const currentSongs = this.assignedSongs[slot.uid] || [];
            const nextSongs = currentSongs.some((currentSong) => currentSong.uid === song.uid)
                ? currentSongs
                : [...currentSongs, song];
            this.assignedSongs = { ...this.assignedSongs, [slot.uid]: nextSongs };
            if (nextSongs.length === 1) {
                this.getSongSearchControl(slot).setValue(song.title || '', { emitEvent: false });
            } else {
                this.getSongSearchControl(slot).setValue('', { emitEvent: false });
            }
            this.assignmentIds = {
                ...this.assignmentIds,
                [slot.uid]: { ...this.assignmentIds[slot.uid], [song.uid]: uid },
            };
            this.assignedSongTitles = { ...this.assignedSongTitles, [song.uid]: song.title || '' };
            this.changeDetectorRef.markForCheck();
        }
    }

    async removeSong(slot: EventSlot, song: PartialSong): Promise<void> {
        const assignmentId = this.assignmentIds[slot.uid]?.[song.uid];
        if (!assignmentId) {
            return;
        }

        if (await this.repertoireService.deleteRepertoireSong(assignmentId)) {
            this.assignedSongs = {
                ...this.assignedSongs,
                [slot.uid]: (this.assignedSongs[slot.uid] || []).filter(
                    (assignedSong) => assignedSong.uid !== song.uid
                ),
            };
            const slotAssignments = { ...this.assignmentIds[slot.uid] };
            delete slotAssignments[song.uid];
            this.assignmentIds = { ...this.assignmentIds, [slot.uid]: slotAssignments };
            const remainingSong = this.assignedSongs[slot.uid][0];
            this.getSongSearchControl(slot).setValue(remainingSong?.title || '', { emitEvent: false });
            this.changeDetectorRef.markForCheck();
        }
    }

    isSlotSkipped(slot: EventSlot): boolean {
        return this.skippedSlotIds.has(slot.uid);
    }

    async toggleSlotSkipped(slot: EventSlot): Promise<void> {
        if (!this.repertoire?.uid) {
            return;
        }

        const isSkipped = this.isSlotSkipped(slot);
        const uid = await this.repertoireService.saveRepertoireSlotStatus(
            this.repertoire.uid,
            slot.uid,
            slot.order,
            isSkipped ? 'assigned' : 'skipped'
        );
        if (!uid) {
            return;
        }

        if (isSkipped) {
            this.skippedSlotIds.delete(slot.uid);
            this.getSongSearchControl(slot).enable({ emitEvent: false });
        } else {
            this.skippedSlotIds.add(slot.uid);
            delete this.assignedSongIds[slot.uid];
            const control = this.getSongSearchControl(slot);
            control.setValue('', { emitEvent: false });
            control.disable({ emitEvent: false });
        }
        this.changeDetectorRef.markForCheck();
    }

    getSongSearchControl(slot: EventSlot): UntypedFormControl {
        if (!this.songSearchControls[slot.uid]) {
            this.songSearchControls[slot.uid] = new UntypedFormControl('');
        }
        return this.songSearchControls[slot.uid];
    }

    private setupSongSearch(slot: EventSlot): void {
        const control = new UntypedFormControl(this.assignedSongs[slot.uid]?.length === 1 ? this.assignedSongs[slot.uid][0].title : '');
        this.songSearchControls[slot.uid] = control;
        if (this.isSlotSkipped(slot)) {
            control.disable({ emitEvent: false });
        }
        control.valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged(),
                switchMap((value) => {
                    const term = typeof value === 'string' ? value.trim() : '';
                    return term.length >= 2 ? this.songService.searchByTitleContains(term, 20) : of([]);
                }),
                catchError(() => of([])),
                takeUntil(this.unsubscribeAll)
            )
                            .subscribe((songs) => {
                this.songSearchResults[slot.uid] = songs;
                this.changeDetectorRef.markForCheck();
            });
    }

    filteredSongs(slot: EventSlot): PartialSong[] {
        const value = this.getSongSearchControl(slot).value;
        const searchTerm = (typeof value === 'string' ? value : value?.title || '').trim().toLocaleLowerCase();
        if (!searchTerm) {
            return [];
        }

        return this.songSearchResults[slot.uid] || [];
    }

    songTitle(_songId: string): string {
        return this.assignedSongTitles[_songId] || '';
    }

    displaySong(song: PartialSong | string | null): string {
        return typeof song === 'string' ? song : song?.title || '';
    }

    trackByUid(_index: number, item: { uid: string }): string {
        return item.uid;
    }
}
