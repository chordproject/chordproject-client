import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Subject, forkJoin, of, takeUntil } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { AuthService } from 'app/core/firebase/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { EventType } from 'app/models/event-type';
import { Repertoire } from 'app/models/repertoire';
import { RepertoireGroupWithChildren } from 'app/models/repertoire-group';
import { RepertoireCreateDialogComponent, RepertoireCreateDialogResult } from './repertoire-create-dialog.component';

@Component({
    selector: 'repertoire-page',
    standalone: true,
    templateUrl: './repertoire.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        RouterLink,
        TranslocoModule,
    ],
})
export class RepertoireComponent implements OnInit, OnDestroy {
    private static readonly DRAFT_STORAGE_KEY = 'repertoire_new_draft';
    private static readonly UNGROUPED_FILTER = 'ungrouped';

    eventTypes: EventType[] = [];
    repertoires: Repertoire[] = [];
    repertoireGroups: RepertoireGroupWithChildren[] = [];
    repertoireSongsMap: Record<string, { slotName?: string; songTitle: string }[]> = {};
    repertoireSearchTerm = '';
    repertoireEventTypeFilter = 'all';
    repertoireGroupFilter = 'all';
    viewMode: 'grid' | 'list' = 'grid';
    loading = false;
    private readonly unsubscribeAll = new Subject<void>();

    constructor(
        private readonly repertoireService: RepertoireService,
        private readonly songService: SongService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly confirmationService: FuseConfirmationService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        private readonly router: Router,
        private readonly matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.restoreDraftIfAuthenticated();
        this.loadEventTypes();
        this.loadRepertoires();
        this.loadRepertoireGroups();
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

    loadRepertoireGroups(): void {
        this.repertoireService
            .getRepertoireGroups()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((groups) => {
                this.repertoireGroups = groups;
                if (
                    this.repertoireGroupFilter !== 'all' &&
                    this.repertoireGroupFilter !== RepertoireComponent.UNGROUPED_FILTER &&
                    !groups.some(({ group }) => group.uid === this.repertoireGroupFilter)
                ) {
                    this.repertoireGroupFilter = 'all';
                }
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

                    this.songService
                        .getAll(Array.from(allSongIds))
                        .pipe(
                            catchError(() => of([])),
                            takeUntil(this.unsubscribeAll)
                        )
                        .subscribe((songs) => {
                        const titleMap = new Map<string, string>();
                            songs.forEach((song) => {
                                if (song?.uid) {
                                    titleMap.set(song.uid, song.title || '');
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

    get repertoireSections(): { key: 'personal' | 'public'; label: string; repertoires: Repertoire[] }[] {
        return [
            {
                key: 'personal',
                label: 'repertoire_page.my_repertoires',
                repertoires: this.repertoires.filter(
                    (repertoire) => this.repertoireService.isOwnedByCurrentUser(repertoire) && !this.isPublicRepertoire(repertoire)
                ),
            },
            {
                key: 'public',
                label: 'repertoire_page.public_repertoires',
                repertoires: this.repertoires.filter((repertoire) => this.isPublicRepertoire(repertoire)),
            },
        ];
    }

    getFilteredRepertoires(repertoires: Repertoire[]): Repertoire[] {
        const term = this.normalize(this.repertoireSearchTerm);
        const byType = this.repertoireEventTypeFilter === 'all'
            ? repertoires
            : repertoires.filter((repertoire) => repertoire.eventTypeId === this.repertoireEventTypeFilter);
        const byGroup = this.repertoireGroupFilter === 'all'
            ? byType
            : this.repertoireGroupFilter === RepertoireComponent.UNGROUPED_FILTER
                ? byType.filter((repertoire) => !this.isRepertoireInAnyGroup(repertoire.uid))
                : byType.filter((repertoire) => this.isRepertoireInGroup(repertoire.uid, this.repertoireGroupFilter));
        const filtered = !term
            ? byGroup
            : byGroup.filter((repertoire) => {
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

    isPublicRepertoire(repertoire: Repertoire): boolean {
        return this.repertoireService.isSharedRepertoire(repertoire);
    }

    canEditRepertoire(repertoire: Repertoire): boolean {
        return this.repertoireService.isOwnedByCurrentUser(repertoire);
    }

    openCreateRepertoireDialog(): void {
        this.matDialog
            .open(RepertoireCreateDialogComponent, { data: { eventTypes: this.eventTypes } })
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((result) => {
                if (result) {
                    this.saveNewRepertoire(result);
                }
            });
    }

    private async saveNewRepertoire(result: RepertoireCreateDialogResult): Promise<void> {
        const isAuthenticated = await new Promise<boolean>((resolve) =>
            this.userService.isAuthenticated().pipe(take(1)).subscribe(resolve)
        );
        if (!isAuthenticated) {
            // Sign-in navigates away, so stash the draft to restore once the user is back and authenticated.
            sessionStorage.setItem(
                RepertoireComponent.DRAFT_STORAGE_KEY,
                JSON.stringify({
                    eventTypeId: result.eventTypeId,
                    title: result.title,
                    description: result.description,
                    date: result.date.toISOString(),
                })
            );
            this.authService.promptSignIn();
            return;
        }

        const uid = await this.repertoireService.saveRepertoire({
            eventTypeId: result.eventTypeId,
            title: result.title,
            description: result.description,
            date: result.date,
        } as Repertoire);
        if (uid) {
            this.router.navigate(['/repertoires', uid]);
        }
    }

    /** Restores a draft stashed before a sign-in redirect, submitting it automatically once the user is authenticated again. */
    private restoreDraftIfAuthenticated(): void {
        const raw = sessionStorage.getItem(RepertoireComponent.DRAFT_STORAGE_KEY);
        if (!raw) {
            return;
        }

        this.userService
            .isAuthenticated()
            .pipe(take(1))
            .subscribe((isAuthenticated) => {
                if (!isAuthenticated) {
                    return;
                }

                sessionStorage.removeItem(RepertoireComponent.DRAFT_STORAGE_KEY);
                try {
                    const draft = JSON.parse(raw);
                    this.saveNewRepertoire({
                        eventTypeId: draft.eventTypeId,
                        title: draft.title,
                        description: draft.description,
                        date: draft.date ? new Date(draft.date) : new Date(),
                    });
                } catch {
                    // Ignore a corrupted draft.
                }
            });
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
        return this.getFilteredRepertoires(this.repertoires);
    }

    private isRepertoireInGroup(repertoireId: string, groupId: string): boolean {
        return this.repertoireGroups
            .find(({ group }) => group.uid === groupId)
            ?.repertoires.some((repertoire) => repertoire.uid === repertoireId) ?? false;
    }

    private isRepertoireInAnyGroup(repertoireId: string): boolean {
        return this.repertoireGroups.some(({ repertoires }) =>
            repertoires.some((repertoire) => repertoire.uid === repertoireId)
        );
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
