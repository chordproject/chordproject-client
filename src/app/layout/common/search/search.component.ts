import { Overlay } from '@angular/cdk/overlay';
import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import {
    MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
    MatAutocomplete,
    MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { fuseAnimations } from '@fuse/animations/public-api';
import { SongService } from 'app/core/firebase/api/song.service';
import { SongbookService } from 'app/core/firebase/api/songbook.service';
import { SearchResultSets } from 'app/models/searchResultSets';
import { Subject, debounceTime, filter, forkJoin, map, takeUntil } from 'rxjs';
import { SearchResultsComponent } from './search-results.component';

@Component({
    selector: 'search',
    templateUrl: './search.component.html',
    encapsulation: ViewEncapsulation.None,
    exportAs: 'fuseSearch',
    animations: fuseAnimations,
    standalone: true,
    imports: [
        MatButtonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatOptionModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        SearchResultsComponent,
    ],
    providers: [
        {
            provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
            useFactory: () => {
                const overlay = inject(Overlay);
                return () => overlay.scrollStrategies.block();
            },
        },
    ],
})
export class SearchComponent implements OnInit, OnDestroy {
    @Input() appearance: 'basic' | 'bar' = 'basic';
    @Input() debounce: number = 300;
    @Input() minLength: number = 2;
    @Output() search: EventEmitter<SearchResultSets> = new EventEmitter<SearchResultSets>();

    resultSets: SearchResultSets | null = null;
    opened: boolean = false;
    searchControl: UntypedFormControl = new UntypedFormControl();
    private _matAutocomplete: MatAutocomplete;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    @ViewChild('searchResults') searchResults: SearchResultsComponent;

    constructor(
        private _songService: SongService,
        private _songbookService: SongbookService,
        private _elementRef: ElementRef
    ) {}

    @HostBinding('class') get classList(): any {
        return {
            'search-appearance-bar': this.appearance === 'bar',
            'search-appearance-basic': this.appearance === 'basic',
            'search-opened': this.opened,
        };
    }

    @ViewChild('barSearchInput')
    set barSearchInput(value: ElementRef) {
        // If the value exists, it means that the search input
        // is now in the DOM, and we can focus on the input..
        if (value) {
            // Give Angular time to complete the change detection cycle
            setTimeout(() => {
                // Focus to the input element
                value.nativeElement.focus();
            });
        }
    }

    @ViewChild('matAutocomplete')
    set matAutocomplete(value: MatAutocomplete) {
        this._matAutocomplete = value || this.searchResults?.matAutocomplete;
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Appearance
        if ('appearance' in changes) {
            // To prevent any issues, close the
            // search after changing the appearance
            this.close();
        }
    }

    ngOnInit(): void {
        this.searchControl.valueChanges
            .pipe(
                debounceTime(this.debounce),
                takeUntil(this._unsubscribeAll),
                map((value) => {
                    // Set the resultSets to null if there is no value or
                    // the length of the value is smaller than the minLength
                    // so the autocomplete panel can be closed
                    if (!value || value.length < this.minLength) {
                        this.resultSets = null;
                    }
                    return value;
                }),
                // Filter out undefined/null/false statements and also
                // filter out the values that are smaller than minLength
                filter((value) => value && value.length >= this.minLength)
            )
            .subscribe((value) => {
                const searchTerm = value;
                forkJoin({
                    songs: this._songService.searchByTitle(searchTerm, 5),
                    songsContent: this._songService.searchByLyrics(searchTerm, 5),
                    songbooks: this._songbookService.searchSongbooks(searchTerm, 3),
                    songsInSongbooks: this._songbookService.searchSongsInSongbooks(searchTerm, 3, 3),
                }).subscribe((resultSets) => {
                    // Filtrar duplicados: quitar de songsContent los que ya están en songs
                    const songUids = new Set(resultSets.songs.map((song) => song.uid));
                    resultSets.songsContent = resultSets.songsContent.filter((song) => !songUids.has(song.uid));
                    // Store the result sets
                    this.resultSets = resultSets;

                    // Execute the event
                    this.search.next(resultSets);
                });
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onKeydown(event: KeyboardEvent): void {
        // Escape
        if (event.code === 'Escape') {
            // If the appearance is 'bar' and the mat-autocomplete is not open, close the search
            if (this.appearance === 'bar' && !this.searchResults?.matAutocomplete?.isOpen) {
                this.close();
            }
        }
    }

    open(event: Event): void {
        event.stopPropagation();
        // Return if it's already opened
        if (this.opened) {
            return;
        }
        // Open the search
        this.opened = true;
    }

    close(): void {
        // Return if it's already closed
        if (!this.opened) {
            return;
        }
        // Clear the search input
        this.searchControl.setValue('');

        // Close the search
        this.opened = false;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent): void {
        if (!this._elementRef.nativeElement.contains(event.target)) {
            this.close();
        }
    }
}
