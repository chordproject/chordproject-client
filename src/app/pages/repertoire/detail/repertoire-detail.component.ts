import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, forkJoin, of, switchMap, takeUntil } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
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
        MatTooltipModule,
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
    addingSongSlotIds = new Set<string>();
    skippedSlotIds = new Set<string>();
    songSearchControls: Record<string, UntypedFormControl> = {};
    editingHeader = false;
    editingTitle = '';
    editingDescription = '';
    loading = true;
    loadError = false;
    canEdit = false;
    forking = false;
    private readonly unsubscribeAll = new Subject<void>();

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly repertoireService: RepertoireService,
        private readonly songService: SongService,
        private readonly confirmationService: FuseConfirmationService,
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
                this.canEdit = this.repertoireService.isOwnedByCurrentUser(result);
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
                        this.songService
                            .getAll(assignedSongIds)
                            .pipe(
                                catchError(() => of([] as PartialSong[])),
                                takeUntil(this.unsubscribeAll)
                            )
                            .subscribe((assignedSongs) => {
                                assignedSongs.forEach((song) => {
                                    this.assignedSongTitles[song.uid] = song.title || '';
                                });
                                const songsById = new Map<string, PartialSong>(
                                    assignedSongs.map((song): [string, PartialSong] => [song.uid, song])
                                );
                                this.slots.forEach((slot) => {
                                    this.assignedSongs[slot.uid] = assignments
                                        .filter((item) => item.slotId === slot.uid)
                                        .map((item) => songsById.get(item.songId))
                                        .filter((song): song is PartialSong => !!song);
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
            this.getSongSearchControl(slot).setValue('', { emitEvent: false });
            this.addingSongSlotIds.delete(slot.uid);
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
            this.getSongSearchControl(slot).setValue('', { emitEvent: false });
            if (!this.assignedSongs[slot.uid]?.length) {
                this.addingSongSlotIds.delete(slot.uid);
            }
            this.changeDetectorRef.markForCheck();
        }
    }

    async moveSong(slot: EventSlot, songIndex: number, direction: -1 | 1): Promise<void> {
        const currentSongs = this.assignedSongs[slot.uid] || [];
        const nextIndex = songIndex + direction;
        if (nextIndex < 0 || nextIndex >= currentSongs.length) {
            return;
        }

        const nextSongs = [...currentSongs];
        const [song] = nextSongs.splice(songIndex, 1);
        nextSongs.splice(nextIndex, 0, song);

        const songOrders = nextSongs
            .map((assignedSong, index) => ({
                uid: this.assignmentIds[slot.uid]?.[assignedSong.uid],
                songOrder: index,
            }))
            .filter((item): item is { uid: string; songOrder: number } => !!item.uid);

        if (songOrders.length !== nextSongs.length) {
            return;
        }

        if (await this.repertoireService.updateRepertoireSongOrder(songOrders)) {
            this.assignedSongs = { ...this.assignedSongs, [slot.uid]: nextSongs };
            this.changeDetectorRef.markForCheck();
        }
    }

    startAddingSong(slot: EventSlot): void {
        this.addingSongSlotIds.add(slot.uid);
        this.getSongSearchControl(slot).setValue('', { emitEvent: false });
        this.changeDetectorRef.markForCheck();
    }

    cancelAddingSong(slot: EventSlot): void {
        this.addingSongSlotIds.delete(slot.uid);
        this.getSongSearchControl(slot).setValue('', { emitEvent: false });
        this.changeDetectorRef.markForCheck();
    }

    showSongInput(slot: EventSlot): boolean {
        return !this.assignedSongs[slot.uid]?.length || this.addingSongSlotIds.has(slot.uid);
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
            this.addingSongSlotIds.delete(slot.uid);
            const control = this.getSongSearchControl(slot);
            control.setValue('', { emitEvent: false });
            control.disable({ emitEvent: false });
        }
        this.changeDetectorRef.markForCheck();
    }

    startEditingHeader(): void {
        if (!this.repertoire) {
            return;
        }

        this.editingTitle = this.repertoire.title || '';
        this.editingDescription = this.repertoire.description || '';
        this.editingHeader = true;
    }

    cancelEditingHeader(): void {
        this.editingHeader = false;
    }

    async saveHeader(): Promise<void> {
        if (!this.repertoire?.uid) {
            return;
        }

        const title = this.editingTitle.trim();
        if (!title) {
            return;
        }

        const description = this.editingDescription.trim();
        const updatedRepertoire: Repertoire = {
            ...this.repertoire,
            title,
            description: description || undefined,
        };

        const uid = await this.repertoireService.saveRepertoire(updatedRepertoire);
        if (uid) {
            this.repertoire = updatedRepertoire;
            this.editingHeader = false;
            this.changeDetectorRef.markForCheck();
        }
    }

    deleteRepertoire(): void {
        if (!this.repertoire?.uid) {
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
                if (result === 'confirmed' && this.repertoire?.uid) {
                    const success = await this.repertoireService.deleteRepertoire(this.repertoire.uid);
                    if (success) {
                        this.router.navigate(['/repertoires']);
                    }
                }
            });
    }

    async forkRepertoire(): Promise<void> {
        if (!this.repertoire?.uid || this.forking) {
            return;
        }

        this.forking = true;
        this.changeDetectorRef.markForCheck();

        this.repertoireService
            .forkRepertoire(this.repertoire.uid)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((newRepertoireId) => {
                this.forking = false;
                if (newRepertoireId) {
                    this.router.navigate(['/repertoires', newRepertoireId]);
                } else {
                    this.changeDetectorRef.markForCheck();
                }
            });
    }

    getSongSearchControl(slot: EventSlot): UntypedFormControl {
        if (!this.songSearchControls[slot.uid]) {
            this.songSearchControls[slot.uid] = new UntypedFormControl('');
        }
        return this.songSearchControls[slot.uid];
    }

    private setupSongSearch(slot: EventSlot): void {
        const control = new UntypedFormControl('');
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

        const assignedIds = new Set((this.assignedSongs[slot.uid] || []).map((song) => song.uid));

        return (this.songSearchResults[slot.uid] || []).filter((song) => !assignedIds.has(song.uid));
    }

    /** Shows the artist alongside the title only when another matching song shares the same title. */
    songOptionSubtitle(song: PartialSong, slot: EventSlot): string | null {
        if (!song.artists?.length) {
            return null;
        }

        const normalizedTitle = song.title?.trim().toLocaleLowerCase();
        const hasDuplicateTitle = this.filteredSongs(slot).some(
            (other) => other.uid !== song.uid && other.title?.trim().toLocaleLowerCase() === normalizedTitle
        );

        return hasDuplicateTitle ? song.artists.join(', ') : null;
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
