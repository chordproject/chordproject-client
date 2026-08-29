import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ChpSongItemComponent } from 'app/components/song-item/song-item.component';
import { PartialSong } from 'app/models/partialsong';

/** Rounded list of `chp-song-item`s with an empty state, shared by library/songbook/repertoire "list + preview" pages. */
@Component({
    selector: 'chp-song-list-panel',
    standalone: true,
    templateUrl: './song-list-panel.component.html',
    imports: [MatIconModule, ChpSongItemComponent],
})
export class ChpSongListPanelComponent {
    @Input() songs: PartialSong[] = [];
    @Input() selectedSongId: string | null = null;
    @Input() emptyIcon = 'book-open';
    @Input() emptyMessage = '';
    /** Optional per-row badge (e.g. the repertoire slot a song belongs to). */
    @Input() labelFor: (song: PartialSong) => string | undefined = () => undefined;

    @Output() songSelect = new EventEmitter<PartialSong>();
    @Output() songDblClick = new EventEmitter<PartialSong>();

    trackByFn(_index: number, song: PartialSong): string {
        return song.uid;
    }
}
