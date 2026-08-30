import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Observable, Subject, forkJoin, of, takeUntil } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ChpSongItemComponent } from 'app/components/song-item/song-item.component';
import { RepertoireService } from 'app/core/firebase/api/repertoire.service';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { FeedbackService } from 'app/core/firebase/api/feedback.service';
import { EventSlot } from 'app/models/event-slot';
import { PartialSong } from 'app/models/partialsong';
import { Repertoire } from 'app/models/repertoire';
import { RepertoireSong } from 'app/models/repertoire-song';
import { Songbook } from 'app/models/songbook';
import { SongbookGroupWithChildren } from 'app/models/songbook-group';
import { environment } from 'environments/environment';

type UpcomingRepertoire = {
    repertoire: Repertoire;
    eventTypeName: string;
    scheduledDate: Date;
    songCount: number;
};

type UpcomingRepertoireSchedule = {
    repertoire: Repertoire;
    scheduledDate: Date;
};

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [
        TranslocoModule,
        AsyncPipe,
        MatButtonModule,
        MatIconModule,
        SearchComponent,
        ChpSongItemComponent,
        RouterLink,
        DatePipe,
    ],
})
export class HomeComponent implements OnInit, OnDestroy {
    protected readonly brand = environment.brand;
    protected readonly brandLogoLight = `url('/${environment.brand}/logo/logo-text-light.svg')`;
    protected readonly brandLogoDark = `url('/${environment.brand}/logo/logo-text-dark.svg')`;
    features: string[] = [];
    latestSongs$: Observable<PartialSong[]>;
    upcomingRepertoire$: Observable<UpcomingRepertoire | null>;
    publicSongbookGroups$: Observable<SongbookGroupWithChildren[]>;
    // Fixed-size grid of decorative background logos (size/spacing controlled purely via CSS).
    watermarkTiles = Array.from({ length: 240 });
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _translocoService: TranslocoService,
        private _songService: SongService,
        private _songbookService: SongbookService,
        private _repertoireService: RepertoireService,
        private _feedbackService: FeedbackService
    ) {}

    handleContentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement | null;
        const feedbackLink = target?.closest('a[data-feedback-link], a[href="#feedback"]');
        if (!feedbackLink) {
            return;
        }

        event.preventDefault();
        this._feedbackService.requestOpen();
    }

    ngOnInit(): void {
        // Get latest songs
        this.latestSongs$ = this._songService.getLatest();
        this.upcomingRepertoire$ = this.getUpcomingRepertoire();
        this.publicSongbookGroups$ = this._songbookService.getRecommendedGroups().pipe(
            map((groups) => this.sortPublicSongbookGroups(groups).slice(0, 4)),
            catchError(() => of([] as SongbookGroupWithChildren[]))
        );

        // Inicializar las características basadas en el idioma actual
        this.updateFeatures(this._translocoService.getActiveLang());

        // Escuchar cambios de idioma y actualizar el array de características
        this._translocoService.langChanges$.pipe(takeUntil(this._unsubscribeAll)).subscribe((lang) => {
            this.updateFeatures(lang);
        });
    }

    ngOnDestroy(): void {
        // Cancelar todas las suscripciones para evitar memory leaks
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    /**
     * Actualiza el array de características basado en el idioma
     */
    private updateFeatures(lang: string): void {
        // Usar selectTranslateObject para obtener las traducciones completas
        this._translocoService.selectTranslateObject('home', {}, lang).subscribe((homeTranslations) => {
            // Verificar si existe la estructura home.features
            if (homeTranslations && Array.isArray(homeTranslations.features)) {
                this.features = homeTranslations.features;
            } else {
                this.features = [];
            }
        });
    }

    trackByFn(index: number, item: PartialSong): any {
        return item.uid || index;
    }

    trackSongbookGroupByFn(index: number, item: SongbookGroupWithChildren): string | number {
        return item.group.uid || index;
    }

    trackSongbookByFn(index: number, item: Songbook): string | number {
        return item.uid || index;
    }

    private sortPublicSongbookGroups(groups: SongbookGroupWithChildren[]): SongbookGroupWithChildren[] {
        return groups
            .map((group) => ({
                ...group,
                songbooks: this.sortPublicSongbooks(group.songbooks),
            }))
            .sort((first, second) => this.publicSongbookPriority(first) - this.publicSongbookPriority(second));
    }

    private sortPublicSongbooks(songbooks: Songbook[]): Songbook[] {
        return [...songbooks].sort((first, second) => this.publicSongbookPriority(first) - this.publicSongbookPriority(second));
    }

    private publicSongbookPriority(item: SongbookGroupWithChildren | Songbook): number {
        if (this.brand !== 'hj') {
            return 0;
        }

        const name = 'group' in item ? item.group.name : item.name;
        return this.normalizeText(name) === 'la santa misa' ? -1 : 0;
    }

    private normalizeText(value: string): string {
        return value
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    private getUpcomingRepertoire(): Observable<UpcomingRepertoire | null> {
        return this._repertoireService.getRepertoires().pipe(
            map((repertoires) => this.findUpcomingRepertoireSchedule(repertoires)),
            switchMap((schedule) => {
                if (!schedule) {
                    return of(null);
                }

                const { repertoire, scheduledDate } = schedule;

                return forkJoin({
                    eventType: this._repertoireService.getEventType(repertoire.eventTypeId).pipe(catchError(() => of(null))),
                    slots: this._repertoireService.getEventSlots(repertoire.eventTypeId).pipe(catchError(() => of([] as EventSlot[]))),
                    assignments: this._repertoireService.getRepertoireSongs(repertoire.uid).pipe(catchError(() => of([] as RepertoireSong[]))),
                }).pipe(
                    switchMap(({ eventType, slots, assignments }) => {
                        const activeAssignments = assignments.filter(
                            (assignment) => assignment.status !== 'skipped' && assignment.songId && assignment.slotId
                        );
                        const songIds = [...new Set(activeAssignments.map((assignment) => assignment.songId))];

                        return this._songService.getAll(songIds).pipe(
                            catchError(() => of([] as PartialSong[])),
                            map((songs) => {
                                const songsById = new Map(songs.map((song): [string, PartialSong] => [song.uid, song]));
                                const songCount = activeAssignments.filter((assignment) => songsById.has(assignment.songId)).length;

                                return {
                                    repertoire,
                                    eventTypeName: eventType?.name || '',
                                    scheduledDate,
                                    songCount,
                                };
                            })
                        );
                    })
                );
            }),
            catchError(() => of(null))
        );
    }

    private findUpcomingRepertoireSchedule(repertoires: Repertoire[]): UpcomingRepertoireSchedule | null {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return (
            repertoires
                .flatMap((repertoire) =>
                    [repertoire.date, ...(repertoire.additionalDates || [])]
                        .map((date) => this.toDate(date))
                        .filter((date): date is Date => !!date)
                        .map((scheduledDate) => ({ repertoire, scheduledDate }))
                )
                .filter((schedule) => this.startOfDayMillis(schedule.scheduledDate) >= today.getTime())
                .sort((first, second) => first.scheduledDate.getTime() - second.scheduledDate.getTime())[0] || null
        );
    }

    private startOfDayMillis(date: Date): number {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        return startOfDay.getTime();
    }

    private toDate(value: unknown): Date | null {
        const millis = this.toMillis(value);
        return millis ? new Date(millis) : null;
    }

    private toMillis(value: unknown): number {
        if (value instanceof Date) {
            return value.getTime();
        }
        if (value && typeof value === 'object' && typeof (value as { seconds?: unknown }).seconds === 'number') {
            return (value as { seconds: number }).seconds * 1000;
        }

        const parsedDate = new Date(value as string | number).getTime();
        return Number.isNaN(parsedDate) ? 0 : parsedDate;
    }
}
