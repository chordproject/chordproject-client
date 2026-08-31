import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { Songbook } from 'app/models/songbook';
import { Tag, TagOption } from 'app/models/tag';
import { JoinPipe } from 'app/pipes/join.pipe';

@Component({
    selector: 'chp-song-header',
    standalone: true,
    templateUrl: './song-header.component.html',
    imports: [
        AsyncPipe,
        JoinPipe,
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterLink,
        TranslocoModule,
    ],
})
export class ChpSongHeaderComponent {
    @Input() song: Song | PartialSong;
    @Input() pendingSuggestion = false;
    @Input() alternateVersions: PartialSong[] = [];
    @Input() alternateVersionRoute: 'reader' | 'editor' = 'reader';
    @Input() showFullEditor = false;
    @Input() showClose = false;
    /** Hides the close button above the `lg` breakpoint, e.g. when the preview pane is always visible on desktop. */
    @Input() closeOnlyOnMobile = false;
    @Input() centerContent = true;

    // Optional songbook / tag controls
    @Input() associatedSongbooks: Songbook[] = [];
    @Input() pendingSongbooks: Songbook[] = [];
    @Input() associatedTags: Tag[] = [];
    @Input() songbookSearchControl?: UntypedFormControl;
    @Input() filteredSongbooks$?: Observable<Songbook[]>;
    @Input() tagSearchControl?: UntypedFormControl;
    @Input() filteredTags$?: Observable<TagOption[]>;

    @Output() openFullEditor = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();
    @Output() removeSongbook = new EventEmitter<Songbook>();
    @Output() addSongToSongbook = new EventEmitter<Songbook>();
    @Output() removeTag = new EventEmitter<Tag>();
    @Output() tagSelected = new EventEmitter<TagOption>();

    isSongbookOpen = signal(false);
    isSongbookHovered = signal(false);
    isTagOpen = signal(false);
    isTagHovered = signal(false);

    get isSongbookExpanded(): boolean {
        return this.isSongbookOpen() || this.isSongbookHovered() || Boolean(this.songbookSearchControl?.value);
    }

    get isTagExpanded(): boolean {
        return this.isTagOpen() || this.isTagHovered() || Boolean(this.tagSearchControl?.value);
    }

    get allVisibleSongbooks(): Songbook[] {
        return [...this.associatedSongbooks, ...this.pendingSongbooks];
    }

    get primarySongbooks(): Songbook[] {
        return this.allVisibleSongbooks.slice(0, 3);
    }

    get additionalSongbooks(): Songbook[] {
        return this.allVisibleSongbooks.slice(3);
    }

    isPendingSongbook(songbook: Songbook): boolean {
        return this.pendingSongbooks.some((pending) => pending.uid === songbook.uid);
    }

    versionRoute(uid: string): string[] {
        return this.alternateVersionRoute === 'editor' ? ['/songs/create', uid] : ['/songs/read', uid];
    }

    displaySongbook(value: Songbook | string | null): string {
        if (!value) return '';
        return typeof value === 'string' ? value : value.name || '';
    }

    songbookTypeLabel(songbook: Songbook): string {
        return songbook.scope === 'shared' && songbook.published === true
            ? 'reader.official_songbook'
            : 'reader.customized_songbook';
    }

    displayTag(value: TagOption | string | null): string {
        if (!value) return '';
        return typeof value === 'string' ? value : value.title || '';
    }

    get hasMetadata(): boolean {
        const s = this.song;
        if (!s) return false;
        return Boolean(
            s.subtitle ||
            s.tempo ||
            s.songKey ||
            s.time ||
            s.capo ||
            s.year ||
            s.composers?.length ||
            s.lyricists?.length ||
            s.arrangers?.length
        );
    }
}
