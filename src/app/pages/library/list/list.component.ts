import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
    computed,
    signal,
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import {
    BehaviorSubject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    merge,
    of,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { ChpSongItemComponent } from 'app/components/song-item/song-item.component';
import { SongService } from 'app/core/firebase/api/song.service';
import {
    DEFAULT_SONG_SORT,
    PartialSong,
    SONG_SORT_DEFAULT_DIRECTION,
    SONG_SORT_FIELDS,
    SongSort,
    SongSortField,
} from 'app/models/partialsong';

const SONGS_PAGE_SIZE = 60;

@Component({
    selector: 'songs-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatMenuModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterLink,
        TranslocoModule,
        ChpSongItemComponent,
    ],
})
export class SongsListComponent implements OnInit, OnDestroy {
    readonly sortFields = SONG_SORT_FIELDS;
    readonly songs = signal<PartialSong[]>([]);
    readonly loaded = signal(false);
    readonly sort = signal<SongSort>(DEFAULT_SONG_SORT);
    readonly visibleCount = signal(SONGS_PAGE_SIZE);
    readonly visibleSongs = computed(() => this.songs().slice(0, this.visibleCount()));
    readonly hasMore = computed(() => this.visibleCount() < this.songs().length);
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    @Input() selectedSong: PartialSong | null = null;
    @Output() songSelect = new EventEmitter<PartialSong>();
    @Output() songDblClick = new EventEmitter<PartialSong>();
    @Output() selectionCleared = new EventEmitter<void>();
    @ViewChild('scrollRoot', { static: true }) private _scrollRoot: ElementRef<HTMLElement>;
    private _sort$ = new BehaviorSubject<SongSort>(DEFAULT_SONG_SORT);
    private _loadMoreObserver: IntersectionObserver;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _songService: SongService
    ) {}

    // El centinela vive dentro de un bloque condicional, por eso se observa desde el setter.
    @ViewChild('loadMoreSentinel')
    set loadMoreSentinel(sentinel: ElementRef<HTMLElement> | undefined) {
        this._loadMoreObserver?.disconnect();

        if (!sentinel) {
            return;
        }

        this._loadMoreObserver = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    this.showMore();
                }
            },
            { root: this._scrollRoot?.nativeElement ?? null, rootMargin: '400px' }
        );
        this._loadMoreObserver.observe(sentinel.nativeElement);
    }

    ngOnInit(): void {
        const search$ = merge(
            of(''), // inicial
            this.searchInputControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
            // cuando se elimina una canción, se rehace la consulta con el término vigente
            this._songService.songsChanged$.pipe(map(() => this.searchInputControl.value || ''))
        );

        combineLatest([search$, this._sort$])
            .pipe(
                switchMap(([query, sort]: [string, SongSort]) => {
                    if (!query) {
                        return this._songService.searchByTitle(undefined, undefined, sort);
                    }
                    if (query.trim().length < 2) {
                        return of([] as PartialSong[]);
                    }
                    return this._songService.searchByTitle(query, 50, sort);
                }),
                takeUntil(this._unsubscribeAll)
            )
            .subscribe((songs) => {
                this.songs.set(songs);
                this.visibleCount.set(SONGS_PAGE_SIZE);
                this.loaded.set(true);
            });

        // Sin debounce: clearSelection ya solo actúa cuando queda algo que deseleccionar.
        this.searchInputControl.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => this.clearSelection());
    }

    ngOnDestroy(): void {
        this._loadMoreObserver?.disconnect();

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    setSortField(field: SongSortField): void {
        this.updateSort({ field, direction: SONG_SORT_DEFAULT_DIRECTION[field] });
    }

    toggleSortDirection(): void {
        this.updateSort({ ...this.sort(), direction: this.sort().direction === 'asc' ? 'desc' : 'asc' });
    }

    // "Ascendente" no dice nada sobre fechas, asi que la etiqueta depende del tipo de dato.
    directionLabel(): string {
        const { field, direction } = this.sort();

        return `library_page.sort.${field === 'creationDate' ? 'date' : 'text'}_${direction}`;
    }

    showMore(): void {
        this.visibleCount.update((count) => Math.min(count + SONGS_PAGE_SIZE, this.songs().length));
    }

    private updateSort(sort: SongSort): void {
        this.sort.set(sort);
        this._sort$.next(sort);
        this._scrollRoot?.nativeElement.scrollTo({ top: 0 });
        this.clearSelection();
    }

    /** Reordenar o buscar cambia lo que se ve en la lista, así que la canción abierta deja de tener contexto. */
    private clearSelection(): void {
        if (this.selectedSong) {
            this.selectionCleared.emit();
        }
    }

    onSongClick(song: PartialSong): void {
        this.songSelect.emit(song);
    }

    onDblClick(song: PartialSong): void {
        this.songDblClick.emit(song);
    }

    trackByFn(index: number, item: any): any {
        return item.uid || index;
    }
}
