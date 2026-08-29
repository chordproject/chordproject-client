import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ChpSongHeaderComponent } from 'app/components/song-header/song-header.component';
import { ChpViewerPanelComponent } from 'app/components/viewer/viewer-panel/viewer-panel.component';
import { PartialSong } from 'app/models/partialsong';
import { Song } from 'app/models/song';
import { Songbook } from 'app/models/songbook';
import { Tag, TagOption } from 'app/models/tag';

@Component({
    selector: 'chp-song-preview',
    standalone: true,
    templateUrl: './song-preview.component.html',
    imports: [ChpSongHeaderComponent, ChpViewerPanelComponent],
})
export class ChpSongPreviewComponent {
    @Input() song: Song | PartialSong;
    @Input() showFullEditor = false;
    @Input() showClose = false;
    @Input() pendingSuggestion = false;
    @Input() alternateVersions: PartialSong[] = [];
    @Input() alternateVersionRoute: 'reader' | 'editor' = 'reader';
    @Input() isPreview = true;
    @Input() compactPreview = true;
    @Input() showEditDelete = false;
    @Input() showDelete = true;
    @Input() centerContent = true;

    // Optional Songbook / Tag inputs passed down to header
    @Input() associatedSongbooks: Songbook[] = [];
    @Input() pendingSongbooks: Songbook[] = [];
    @Input() associatedTags: Tag[] = [];
    @Input() songbookSearchControl?: UntypedFormControl;
    @Input() filteredSongbooks$?: Observable<Songbook[]>;
    @Input() tagSearchControl?: UntypedFormControl;
    @Input() filteredTags$?: Observable<TagOption[]>;

    @Output() openFullEditor = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();
    @Output() editSongEvent = new EventEmitter<void>();
    @Output() deleteSongEvent = new EventEmitter<void>();
    @Output() removeSongbook = new EventEmitter<Songbook>();
    @Output() addSongToSongbook = new EventEmitter<Songbook>();
    @Output() removeTag = new EventEmitter<Tag>();
    @Output() tagSelected = new EventEmitter<TagOption>();

    get content(): string {
        return this.song?.content || this.song?.lyrics || '';
    }
}
